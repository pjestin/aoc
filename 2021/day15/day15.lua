local PriorityQueue = require("lib.priority-queue")
local TableUtils = require("lib.table-utils")
local Vector = require("lib.vector")

local Day15 = {}

function Day15.parse_graph(lines)
    local graph = {}
    for row, line in ipairs(lines) do
        graph[row] = {}
        for col = 1, #line do
            graph[row][col] = tonumber(line:sub(col, col))
        end
    end
    return graph
end

function Day15.find_risk(graph)
    local q = PriorityQueue()
    q:put({
        position = Vector:new{
            x = 1,
            y = 1
        },
        risk = 0
    }, 0)
    local visited = {}
    local risks = {
        [0] = 0
    }

    while not q:empty() do
        local state = q:pop()
        if visited[state.position:to_string()] == nil then
            visited[state.position:to_string()] = true
            local neighbours = {Vector:new{
                x = state.position.x - 1,
                y = state.position.y
            }, Vector:new{
                x = state.position.x + 1,
                y = state.position.y
            }, Vector:new{
                x = state.position.x,
                y = state.position.y - 1
            }, Vector:new{
                x = state.position.x,
                y = state.position.y + 1
            }}
            for _, neighbour in ipairs(neighbours) do
                if neighbour.x >= 1 and neighbour.x <= #graph[1] and neighbour.y >= 1 and neighbour.y <= #graph then
                    local risk = state.risk + graph[neighbour.y][neighbour.x]
                    local neighbour_hash = neighbour:hash()
                    if not risks[neighbour_hash] or risk < risks[neighbour_hash] then
                        risks[neighbour_hash] = risk
                        q:put({
                            position = neighbour,
                            risk = risk
                        }, risk)
                    end
                end
            end
        end
    end

    return risks[Vector:new{
        x = #graph[1],
        y = #graph
    }:hash()]
end

function Day15.find_least_risk_path(lines)
    local graph = Day15.parse_graph(lines)
    return Day15.find_risk(graph)
end

function Day15.repeat_graph(graph)
    local repeated_graph = {}
    for row = 1, #graph do
        for col = 1, #graph[1] do
            for i = 0, 4 do
                for j = 0, 4 do
                    local repeated_row = i * #graph + row
                    local repeated_col = j * #graph[1] + col
                    if not repeated_graph[repeated_row] then
                        repeated_graph[repeated_row] = {}
                    end
                    local risk = (graph[row][col] + i + j - 1) % 9 + 1
                    repeated_graph[repeated_row][repeated_col] = risk
                end
            end
        end
    end
    return repeated_graph
end

function Day15.find_least_risk_path_repeated_graph(lines)
    local graph = Day15.parse_graph(lines)
    graph = Day15.repeat_graph(graph)
    return Day15.find_risk(graph)
end

return Day15
