package com.pjestin.lib;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Arrays;
import java.io.FileNotFoundException;
import java.nio.file.Paths;
import java.nio.file.Path;

public class FileUtilsTest {
  @Test
  public void readLinesTestSuccess() throws FileNotFoundException {
    List<String> testFileContent = Arrays.asList("abc", "efgh");
    Path filePath = Paths.get("src", "test", "resources", "com", "pjestin", "lib", "file-utils", "test-file.txt");
    assertEquals(testFileContent, FileUtils.readLines(filePath));
  }

  @Test
  public void readLinesTestFailure() {
    assertThrows(FileNotFoundException.class, () -> {
      Path filePath = Paths.get("fake", "path");
      FileUtils.readLines(filePath);
    });
  }
}
