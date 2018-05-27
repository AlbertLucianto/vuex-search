import { INDEX_MODES } from 'js-worker-search';
import { SearchApi } from 'vuex-search';

function getSearchApi({ indexMode, tokenizePattern, caseSensitive } = {}) {
  const documentA = { id: 1, name: 'One', description: 'The first document' };
  const documentB = { id: 2, name: 'Two', description: 'The second document' };
  const documentC = { id: 3, name: 'Three', description: 'The third document' };
  const documentD = { id: 4, name: 'Four', description: 'The 4th (fourth) document' };

  // Single-threaded Search API for easier testing
  const searchApi = new SearchApi({ indexMode, tokenizePattern, caseSensitive });
  searchApi.indexResource({
    fieldNamesOrIndexFunction: ['name', 'description'],
    resourceName: 'documents',
    resources: [documentA, documentB, documentC, documentD],
  });

  return searchApi;
}

describe('SearchApi', () => {
  test('performSearch: should return documents ids for any searchable field matching a query', async (done) => {
    const searchApi = getSearchApi();
    const ids = await searchApi.performSearch('documents', 'One');
    expect(ids.length).toEqual(1);
    expect(ids[0]).toEqual(1);
    done();
  });

  test('performSearch: should pass through the correct :indexMode for ALL_SUBSTRINGS', async (done) => {
    const searchApi = getSearchApi({ indexMode: INDEX_MODES.ALL_SUBSTRINGS });

    const matches = await searchApi.performSearch('documents', 'econ');
    expect(matches.length).toEqual(1);
    expect(matches[0]).toEqual(2);

    const noMatches = await searchApi.performSearch('documents', 'xyz');
    expect(noMatches.length).toEqual(0);

    done();
  });

  test('performSearch: should pass through the correct :indexMode for PREFIXES', async (done) => {
    const searchApi = getSearchApi({ indexMode: INDEX_MODES.PREFIXES });

    const matches = await searchApi.performSearch('documents', 'Thre');
    expect(matches.length).toEqual(1);
    expect(matches[0]).toEqual(3);

    const noMatches = await searchApi.performSearch('documents', 'econd');
    expect(noMatches.length).toEqual(0);

    done();
  });

  test('performSearch: should pass through the correct :indexMode for EXACT_WORDS', async (done) => {
    const searchApi = getSearchApi({ indexMode: INDEX_MODES.EXACT_WORDS });

    const matches = await searchApi.performSearch('documents', 'One');
    expect(matches.length).toEqual(1);
    expect(matches[0]).toEqual(1);

    const noMatches = await searchApi.performSearch('documents', 'seco');
    expect(noMatches.length).toEqual(0);

    done();
  });

  test('performSearch: should pass through the correct :tokenizePattern', async (done) => {
    const searchApi = getSearchApi({
      tokenizePattern: /[^a-z0-9]+/,
    });

    const matches = await searchApi.performSearch('documents', 'fourth');
    expect(matches.length).toEqual(1);
    expect(matches[0]).toEqual(4);

    done();
  });

  test('performSearch: should pass through the correct :caseSensitive bit', async (done) => {
    const searchApi = getSearchApi({
      caseSensitive: true,
    });

    let matches = await searchApi.performSearch('documents', 'Second');
    expect(matches.length).toEqual(0);

    matches = await searchApi.performSearch('documents', 'second');
    expect(matches.length).toEqual(1);
    expect(matches[0]).toEqual(2);

    done();
  });

  test('subscribe: notify subscribers for search result', async (done) => {
    const searchApi = getSearchApi();

    const nextCb = jest.fn();
    const errorCb = jest.fn();

    const dispose = searchApi.subscribe(nextCb, errorCb);

    await searchApi.performSearch('documents', 'One');
    expect(nextCb).toHaveBeenCalledTimes(1);
    expect(errorCb).not.toHaveBeenCalled();

    dispose();

    await searchApi.performSearch('documents', 'One');
    expect(nextCb).toHaveBeenCalledTimes(1);
    expect(errorCb).not.toHaveBeenCalled();

    done();
  });

  test('subscribe: notify subscribers for search error and throw error', async (done) => {
    const searchApi = getSearchApi();

    const nextCb = jest.fn();
    const errorCb = jest.fn();

    const dispose = searchApi.subscribe(nextCb, errorCb);

    let error;
    try {
      await searchApi.performSearch('otherDocuments', 'One');
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
    expect(nextCb).not.toHaveBeenCalled();
    expect(errorCb).toHaveBeenCalledTimes(1);

    dispose();

    error = undefined;
    try {
      await searchApi.performSearch('otherDocuments', 'One');
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
    expect(nextCb).not.toHaveBeenCalled();
    expect(errorCb).toHaveBeenCalledTimes(1);

    done();
  });
});
