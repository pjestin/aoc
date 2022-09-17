local Stack = require("lib.stack")

local Day10 = {}

Day10.BRACKET_MAP = {
    ["("] = ")",
    ["["] = "]",
    ["{"] = "}",
    ["<"] = ">"
}

Day10.ILLEGAL_CHARACTER_POINTS = {
    [")"] = 3,
    ["]"] = 57,
    ["}"] = 1197,
    [">"] = 25137
}

Day10.COMPLETING_CHARACTER_POINTS = {
    [")"] = 1,
    ["]"] = 2,
    ["}"] = 3,
    [">"] = 4
}

function Day10.find_first_illegal_character(line)
    local stack = Stack:new()
    for i = 1, #line do
        local char = line:sub(i, i)
        if Day10.BRACKET_MAP[char] ~= nil then
            stack:push(Day10.BRACKET_MAP[char])
        else
            local expected = stack:pop()
            if char ~= expected then
                return char
            end
        end
    end
    return nil
end

function Day10.find_illegal_character_score(lines)
    local score = 0
    for _, line in ipairs(lines) do
        local first_illegal_character = Day10.find_first_illegal_character(line)
        if first_illegal_character ~= nil then
            score = score + Day10.ILLEGAL_CHARACTER_POINTS[first_illegal_character]
        end
    end
    return score
end

function Day10.find_completing_characters(line)
    local stack = Stack:new()
    for i = 1, #line do
        local char = line:sub(i, i)
        if Day10.BRACKET_MAP[char] ~= nil then
            stack:push(Day10.BRACKET_MAP[char])
        else
            local expected = stack:pop()
            if char ~= expected then
                return nil
            end
        end
    end

    local completing_characters = {}
    while not stack:is_empty() do
        table.insert(completing_characters, stack:pop())
    end

    return completing_characters
end

function Day10.find_completing_characters_score(lines)
    local scores = {}
    for _, line in ipairs(lines) do
        local completing_characters = Day10.find_completing_characters(line)
        if completing_characters ~= nil then
            local score = 0
            for _, completing_character in ipairs(completing_characters) do
                score = 5 * score + Day10.COMPLETING_CHARACTER_POINTS[completing_character]
            end
            table.insert(scores, score)
        end
    end
    table.sort(scores)
    return scores[math.floor(#scores / 2) + 1]
end

return Day10
