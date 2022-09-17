local lu = require('luaunit')
local File = require('lib.file')
local Day13 = require('day13.day13')

TestDay13 = {}

function TestDay13:setUp()
    self.input_test = File:lines_from('day13/input-test.txt')
    self.input = File:lines_from('day13/input.txt')
end

function TestDay13:test_count_dots_after_fold()
    lu.assertEquals(Day13.count_dots_after_fold(self.input_test), 17)
    lu.assertEquals(Day13.count_dots_after_fold(self.input), 610)
end

function TestDay13:test_display_dots_after_folds()
    lu.assertEquals(Day13.display_dots_after_folds(self.input_test), {"#####", "#...#", "#...#", "#...#", "#####"})
    lu.assertEquals(Day13.display_dots_after_folds(self.input),
        {"###..####.####...##.#..#.###..####.####", "#..#....#.#.......#.#..#.#..#.#.......#",
         "#..#...#..###.....#.####.#..#.###....#.", "###...#...#.......#.#..#.###..#.....#..",
         "#....#....#....#..#.#..#.#.#..#....#...", "#....####.#.....##..#..#.#..#.#....####"})
end
