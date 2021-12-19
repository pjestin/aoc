local lu = require('luaunit')
local File = require('lib.file')
local Day19 = require('day19.day19')

TestDay19 = {}

function TestDay19:setUp()
    self.input_test = File:lines_from('day19/input-test.txt')
    self.input = File:lines_from('day19/input.txt')
end

function TestDay19:test_count_beacons()
    lu.assertEquals(Day19.count_beacons(self.input_test), 79)
    lu.assertEquals(Day19.count_beacons(self.input), 400)
end

function TestDay19:test_find_greatest_distance()
    lu.assertEquals(Day19.find_greatest_distance(self.input_test), 3621)
    lu.assertEquals(Day19.find_greatest_distance(self.input), 12168)
end
