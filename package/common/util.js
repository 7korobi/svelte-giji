let counter = 360;
export function instanceId() {
  return (counter++).toString(36);
}
