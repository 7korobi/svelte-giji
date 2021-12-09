<svg
  class="icon"
  id="icon-search"
  preserveAspectRatio="xMidYMid slice"
  overflow="visible"
  viewBox="0 0 24 24"
>
  <g fill="none">
    <circle cx="15" cy="9" r="6" fill="var(--pen)" fill-opacity=".3" />
    <path
      d="M3 21L10.5 13.5L10.757 13.243a6 6 0 1 1 8.485-8.486a6 6 0 0 1-8.485 8.486z"
      stroke="var(--pen)"
      stroke-width="2"
      stroke-linecap="round"
      class="line"
    />
  </g>
</svg>

<style lang="scss">
.line {
  animation-delay: 0s;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in;
  animation-direction: alternate;
  animation-fill-mode: forwards;
  animation-name: il-md-length-150;
  opacity: 0;
  stroke-dasharray: 150;
  stroke-dashoffset: 150;
}
</style>
