local lu = require('luaunit')
local File = require('lib.file')
local Day15 = require('day15.day15')

TestDay15 = {}

function TestDay15:setUp()
    self.input_test = File:lines_from('day15/input-test.txt')
    self.input = File:lines_from('day15/input.txt')
end

function TestDay15:test_find_least_risk_path()
    lu.assertEquals(Day15.find_least_risk_path(self.input_test), 40)
    lu.assertEquals(Day15.find_least_risk_path(self.input), 707)
end

function TestDay15:test_find_least_risk_path_repeated_graph()
    lu.assertEquals(Day15.find_least_risk_path_repeated_graph(self.input_test), 315)
    lu.assertEquals(Day15.find_least_risk_path_repeated_graph(self.input), 2942)
end
