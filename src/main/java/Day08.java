import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;
import java.lang.Integer;

public class Day08 {
  private static class TreeNode {
    public List<TreeNode> children = new ArrayList<>();
    public List<Integer> metadata = new ArrayList<>();

    public int getMetadataSum() {
      int metadataSum = metadata.stream().reduce(0, Integer::sum);
      for (TreeNode child : children) {
        metadataSum += child.getMetadataSum();
      }
      return metadataSum;
    }

    public int getNodeValue() {
      if (children.isEmpty()) {
        return metadata.stream().reduce(0, Integer::sum);
      } else {
        int nodeValue = 0;
        for (int metadataEntry : metadata) {
          if (metadataEntry > 0 && metadataEntry <= children.size()) {
            TreeNode child = children.get(metadataEntry - 1);
            nodeValue += child.getNodeValue();
          }
        }
        return nodeValue;
      }
    }
  }

  private static class State {
    public int index = 0;
  }

  private static TreeNode parseTree(List<Integer> numbers, State state) {
    int nbChildren = numbers.get(state.index);
    int nbMetadata = numbers.get(state.index + 1);
    state.index += 2;
    TreeNode node = new TreeNode();
    for (int i = 0; i < nbChildren; i++) {
      node.children.add(parseTree(numbers, state));
    }
    node.metadata = numbers.subList(state.index, state.index + nbMetadata);
    state.index += nbMetadata;
    return node;
  }

  private static TreeNode parseTree(String line) {
    List<Integer> numbers = Arrays.asList(line.split(" ")).stream().map(Integer::parseInt).collect(Collectors.toList());
    State state = new State();
    return parseTree(numbers, state);
  }

  public static int getMetadataSum(String line) {
    return parseTree(line).getMetadataSum();
  }

  public static int getNodeValue(String line) {
    return parseTree(line).getNodeValue();
  }
}
