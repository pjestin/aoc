local lu = require('luaunit')
local File = require('lib.file')
local Day05 = require('day05.day05')

TestDay05 = {}

function TestDay05:setUp()
    self.input_test = File:lines_from('day05/input-test.txt')
    self.input = File:lines_from('day05/input.txt')
end

function TestDay05:test_count_overlaps()
    lu.assertEquals(Day05.count_overlaps(self.input_test, false), 5)
    lu.assertEquals(Day05.count_overlaps(self.input, false), 4421)
end

function TestDay05:test_count_overlaps_diagonal()
    lu.assertEquals(Day05.count_overlaps(self.input_test, true), 12)
    lu.assertEquals(Day05.count_overlaps(self.input, true), 18674)
end
