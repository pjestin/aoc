local StringUtils = require("lib.string-utils")

local Board = {}

function Board:new(o)
    o = o or {
        rows = {}
    }
    setmetatable(o, self)
    self.__index = self
    return o
end

function Board:to_string()
    local result = {}
    for _, row in ipairs(self.rows) do
        table.insert(result, table.concat(row, " "))
    end
    return table.concat(result, "\n")
end

function Board:add_row(row)
    local transformed_row = {}
    for _, number in ipairs(row) do
        table.insert(transformed_row, {
            number = number,
            marked = false
        })
    end
    table.insert(self.rows, transformed_row)
end

function Board:mark(number)
    for _, row in ipairs(self.rows) do
        for _, square in ipairs(row) do
            if square.number == number then
                square.marked = true
            end
        end
    end
end

function Board:is_winning()
    for _, row in ipairs(self.rows) do
        local row_marked = true
        for _, square in ipairs(row) do
            if not square.marked then
                row_marked = false
                break
            end
        end
        if row_marked then
            return true
        end
    end

    for col = 1, #self.rows[1] do
        local col_marked = true
        for _, row in ipairs(self.rows) do
            if not row[col].marked then
                col_marked = false
                break
            end
        end
        if col_marked then
            return true
        end
    end

    return false
end

function Board:score()
    local sum = 0
    for _, row in ipairs(self.rows) do
        for _, square in ipairs(row) do
            if not square.marked then
                sum = sum + square.number
            end
        end
    end
    return sum
end

local Day04 = {}

function Day04.parse_boards(lines)
    local numbers_string = StringUtils.split(lines[1], ",")
    local numbers = {}
    for _, number_string in ipairs(numbers_string) do
        table.insert(numbers, tonumber(number_string))
    end

    local boards = {}
    local current_board = Board:new()
    for i = 3, #lines do
        local line = lines[i]
        if string.len(line) == 0 then
            table.insert(boards, current_board)
            current_board = Board:new()
        else
            local board_numbers_string = StringUtils.split(line)
            local row = {}
            for _, board_number_string in ipairs(board_numbers_string) do
                local board_number = tonumber(board_number_string)
                if board_number then
                    table.insert(row, board_number)
                end
            end
            current_board:add_row(row)
        end
    end
    table.insert(boards, current_board)

    return numbers, boards
end

function Day04.final_score(lines)
    local numbers, boards = Day04.parse_boards(lines)

    for _, number in ipairs(numbers) do
        for _, board in ipairs(boards) do
            board:mark(number)
            if board:is_winning() then
                return board:score() * number
            end
        end
    end
end

function Day04.last_board_score(lines)
    local numbers, boards = Day04.parse_boards(lines)

    for _, number in ipairs(numbers) do
        local nb_boards = 0
        for _, board in pairs(boards) do
            nb_boards = nb_boards + 1
        end
        for j, board in pairs(boards) do
            board:mark(number)
            if board:is_winning() then
                if nb_boards == 1 then
                    return board:score() * number
                end
                boards[j] = nil
            end
        end
    end
end

return Day04
