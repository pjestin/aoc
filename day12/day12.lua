local StringUtils = require("lib.string-utils")
local TableUtils = require("lib.table-utils")
local Queue = require("lib.queue")

local Day12 = {}

function Day12.parse_graph(lines)
    local graph = {}

    for _, line in ipairs(lines) do
        local split_line = StringUtils.split(line, "-")
        local origin = split_line[1]
        local destination = split_line[2]

        if graph[origin] == nil then
            graph[origin] = {}
        end
        table.insert(graph[origin], destination)

        if graph[destination] == nil then
            graph[destination] = {}
        end
        table.insert(graph[destination], origin)
    end

    return graph
end

function Day12.count_paths(lines)
    local graph = Day12.parse_graph(lines)

    local paths = {}
    local queue = Queue:new()
    queue:push({"start", {"start"}, {}})

    while not queue:is_empty() do
        local state = queue:pop()
        local cave = state[1]
        local path = state[2]
        local visited = state[3]

        if cave == "end" then
            table.insert(paths, path)
        elseif not visited[cave] then
            if string.match(cave, "%l") then
                visited[cave] = true
            end

            for _, neigbour in ipairs(graph[cave]) do
                local path_copy = TableUtils.copy(path)
                local visited_copy = TableUtils.copy(visited)
                table.insert(path_copy, neigbour)
                queue:push({neigbour, path_copy, visited_copy})
            end
        end
    end

    return #paths
end

function Day12.count_paths_two_visits(lines)
    local graph = Day12.parse_graph(lines)

    local paths = {}
    local queue = Queue:new()
    queue:push({"start", {"start"}, {}, false})

    while not queue:is_empty() do
        local state = queue:pop()
        local cave = state[1]
        local path = state[2]
        local visited = state[3]
        local visited_twice = state[4]

        if cave == "end" then
            table.insert(paths, path)
        elseif not visited[cave] or (cave ~= "start" and visited[cave] == 1 and not visited_twice) then
            if string.match(cave, "%l") then
                if visited[cave] == 1 then
                    visited[cave] = 2
                    visited_twice = true
                else
                    visited[cave] = 1
                end
            end

            for _, neigbour in ipairs(graph[cave]) do
                local path_copy = TableUtils.copy(path)
                local visited_copy = TableUtils.copy(visited)
                table.insert(path_copy, neigbour)
                queue:push({neigbour, path_copy, visited_copy, visited_twice})
            end
        end
    end

    return #paths
end

return Day12
