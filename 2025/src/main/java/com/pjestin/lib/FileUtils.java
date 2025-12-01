package com.pjestin.lib;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.List;
import java.util.ArrayList;
import java.nio.file.Path;
import java.io.FileWriter;
import java.io.IOException;

public class FileUtils {
    public static List<String> readLines(Path filePath) throws FileNotFoundException {
        List<String> lines = new ArrayList<>();
        File myObj = filePath.toFile();
        Scanner myReader = new Scanner(myObj);
        while (myReader.hasNextLine()) {
            String data = myReader.nextLine();
            lines.add(data);
        }
        myReader.close();
        return lines;
    }

    public static void writeLines(List<String> lines, Path filePath) throws IOException {
        FileWriter myWriter = new FileWriter(filePath.toFile());
        for (String line : lines) {
            myWriter.write(line);
        }
        myWriter.close();
    }
}
