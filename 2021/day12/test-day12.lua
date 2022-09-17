local lu = require('luaunit')
local File = require('lib.file')
local Day12 = require('day12.day12')

TestDay12 = {}

function TestDay12:setUp()
    self.input_test = File:lines_from('day12/input-test.txt')
    self.input_test_2 = File:lines_from('day12/input-test-2.txt')
    self.input = File:lines_from('day12/input.txt')
end

function TestDay12:test_count_paths()
    lu.assertEquals(Day12.count_paths(self.input_test), 10)
    lu.assertEquals(Day12.count_paths(self.input_test_2), 19)
    lu.assertEquals(Day12.count_paths(self.input), 3738)
end

function TestDay12:test_count_paths_two_visits()
    lu.assertEquals(Day12.count_paths_two_visits(self.input_test), 36)
    lu.assertEquals(Day12.count_paths_two_visits(self.input_test_2), 103)
    lu.assertEquals(Day12.count_paths_two_visits(self.input), 120506)
end
