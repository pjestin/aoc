local lu = require('luaunit')
local File = require('lib.file')
local Day04 = require('day04.day04')

TestDay04 = {}

function TestDay04:setUp()
    self.input_test = File:lines_from('day04/input-test.txt')
    self.input = File:lines_from('day04/input.txt')
end

function TestDay04:test_final_score()
    lu.assertEquals(Day04.final_score(self.input_test), 4512)
    lu.assertEquals(Day04.final_score(self.input), 25410)
end

function TestDay04:test_last_board_score()
    lu.assertEquals(Day04.last_board_score(self.input_test), 1924)
    lu.assertEquals(Day04.last_board_score(self.input), 2730)
end

return TestDay04
