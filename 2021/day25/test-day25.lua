local lu = require('luaunit')
local File = require('lib.file')
local Day25 = require('day25.day25')

TestDay25 = {}

function TestDay25:setUp()
    self.input_test = File:lines_from('day25/input-test.txt')
    self.input = File:lines_from('day25/input.txt')
end

function TestDay25:test_count_steps_until_immobile()
    lu.assertEquals(Day25.count_steps_until_immobile(self.input_test), 58)
    lu.assertEquals(Day25.count_steps_until_immobile(self.input), 549)
end
