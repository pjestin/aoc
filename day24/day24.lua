local StringUtils = require("lib.string-utils")
local TableUtils = require("lib.table-utils")
local Queue = require("lib.queue")

local Day24 = {}

local Computer = {}

function Computer:new(o)
    o = o or {
        w = 0,
        x = 0,
        y = 0,
        z = 0,
        inputs = Queue:new()
    }
    setmetatable(o, self)
    self.__index = self
    return o
end

function Computer:run(instruction)
    local arg2_value = instruction.arg2
    if instruction.arg2 and type(instruction.arg2) ~= "number" then
        arg2_value = self[instruction.arg2]
    end
    if instruction.command == "inp" then
        if self.inputs:is_empty() then
            error("Not enough inputs")
        end
        self[instruction.arg1] = self.inputs:pop()
    elseif instruction.command == "add" then
        self[instruction.arg1] = self[instruction.arg1] + arg2_value
    elseif instruction.command == "mul" then
        self[instruction.arg1] = self[instruction.arg1] * arg2_value
    elseif instruction.command == "div" then
        self[instruction.arg1] = math.modf(self[instruction.arg1] / arg2_value)
    elseif instruction.command == "mod" then
        self[instruction.arg1] = self[instruction.arg1] % arg2_value
    elseif instruction.command == "eql" then
        self[instruction.arg1] = self[instruction.arg1] == arg2_value and 1 or 0
    end
end

function Day24.parse_instructions(lines)
    local instructions = {}
    for _, line in ipairs(lines) do
        local split_line = StringUtils.split(line)
        table.insert(instructions, {
            command = split_line[1],
            arg1 = tonumber(split_line[2]) or split_line[2],
            arg2 = tonumber(split_line[3]) or split_line[3],
        })
    end
    return instructions
end

function Day24.try_monad(monad, instructions)
    local computer = Computer:new()
    for _, monad_digit in ipairs(monad) do
        computer.inputs:push(monad_digit)
    end
    for _, instruction in ipairs(instructions) do
        computer:run(instruction)
    end
    return computer.z
end

function Day24.number_to_table(number)
    local t = {}
    local number_string = string.format("%d", number)
    for digit_string in number_string:gmatch("%d") do
        table.insert(t, tonumber(digit_string))
    end
    return t
end

-- conditions:
-- 1: false
-- 2: false
-- 3: false
-- 4: monad[3] + 5 == monad[4]
-- 5: false
-- 6: monad[5] - 3 == monad[6]
-- 7: false
-- 8: monad[7] + 7 == monad[8]
-- 9: false
-- 10: false
-- 11: monad[11] == monad[10] - 1
-- 12: monad[12] == monad[9] + 3
-- 13: monad[13] == monad[2] + 6
-- 14: monad[14] == monad[1]

function Day24.find_output_with_monad(lines, monad_number)
    local instructions = Day24.parse_instructions(lines)
    local monad = Day24.number_to_table(monad_number)
    return Day24.try_monad(monad, instructions)
end

return Day24
