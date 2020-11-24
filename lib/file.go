package lib

import (
	"bufio"
	"fmt"
	"os"
)

func ReadLines(filePath string) (lines []string, err error) {
	readFile, err := os.Open(filePath)
	if err != nil {
		fmt.Println("File reading error", err)
		return
	}
	fileScanner := bufio.NewScanner(readFile)
	fileScanner.Split(bufio.ScanLines)
	for fileScanner.Scan() {
		lines = append(lines, fileScanner.Text())
	}
	readFile.Close()
	return
}
