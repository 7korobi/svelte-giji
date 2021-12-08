<svg
  class="icon"
  id="icon-search"
  preserveAspectRatio="xMidYMid slice"
  overflow="visible"
  viewBox="0 0 24 24"
>
  <g fill="none">
    <path
      d="M10.5 13.5L3 21"
      stroke="var(--pen)"
      stroke-width="2"
      stroke-linecap="round"
      class="line-2-15"
    />
    <circle cx="15" cy="9" r="6" fill="var(--pen)" fill-opacity=".3" class="fill" />
    <path
      d="M10.757 13.243a6 6 0 1 1 8.485-8.486a6 6 0 0 1-8.485 8.486z"
      stroke="var(--pen)"
      stroke-width="2"
      stroke-linecap="round"
      class="line-1-40"
    />
  </g>
</svg>

<style lang="scss">
.line-1-40 {
  animation-delay: 0s;
  animation-duration: 1400ms;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-direction: normal;
  animation-fill-mode: forwards;
  animation-name: il-md-length-40;
  opacity: 0;
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
}

.line-2-15 {
  animation-delay: 1400ms;
  animation-duration: 600ms;
  animation-iteration-count: 1;
  animation-timing-function: ease-out;
  animation-direction: normal;
  animation-fill-mode: forwards;
  animation-name: il-md-length-15;
  opacity: 0;
  stroke-dasharray: 15;
  stroke-dashoffset: 15;
}

.fill {
  animation-delay: 0ms;
  animation-duration: 2000ms;
  animation-iteration-count: 1;
  animation-timing-function: linear;
  animation-direction: normal;
  animation-fill-mode: forwards;
  animation-name: il-md-fill;
  opacity: 0;
}
</style>
