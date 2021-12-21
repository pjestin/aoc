local lu = require('luaunit')
local File = require('lib.file')
local Day21 = require('day21.day21')

TestDay21 = {}

function TestDay21:setUp()
    self.input_test = File:lines_from('day21/input-test.txt')
    self.input = File:lines_from('day21/input.txt')
end

function TestDay21:test_play_deterministic_dice()
    lu.assertEquals(Day21.play_deterministic_dice(self.input_test), 739785)
    lu.assertEquals(Day21.play_deterministic_dice(self.input), 412344)
end

function TestDay21:test_play_dirac_dice()
    lu.assertEquals(Day21.play_dirac_dice(self.input_test), 444356092776315)
    lu.assertEquals(Day21.play_dirac_dice(self.input), 214924284932572)
end
