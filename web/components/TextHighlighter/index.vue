<script>
import highlightChunks from './highlightChunks';

export default {
  props: {
    queries: Array,
    highlightStyles: {},
  },
  render() {
    return <span
      on={this.$listeners}
      {...this.$attrs}
    >
      {this.highlights
        .map((highlight, idx) =>
          <span
            class={{ text__highlight: highlight.isHighlighted }}
            style={this.highlightStyles || {}}
            key={idx}
          >
            {highlight.text}
          </span>,
        )}
    </span>;
  },
  computed: {
    highlights() {
      const text = this.$slots.default[0] ?
        this.$slots.default[0].text : '';

      return highlightChunks(
        text,
        this.queries,
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.text__highlight {
  background: aqua;
  border-radius: 3px;
}
</style>
