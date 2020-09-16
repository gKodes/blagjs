export default function getNode(nodePath, path) {
  return nodePath.get(path)?.node;
}
