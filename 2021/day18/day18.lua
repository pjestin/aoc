local Day18 = {}

function Day18.parse_tree(line)
    local bracket_count = 0
    for i = 1, #line do
        local char = line:sub(i, i)
        if char == "[" then
            bracket_count = bracket_count + 1
        elseif char == "]" then
            bracket_count = bracket_count - 1
        end
        if bracket_count == 1 and i ~= 1 then
            local left = Day18.parse_tree(line:sub(2, i))
            local right = Day18.parse_tree(line:sub(i + 2, #line - 1))
            return {
                left = left,
                right = right
            }
        end
    end

    return tonumber(line)
end

function Day18.insert(tree, insert, side)
    if insert == nil then
        return tree
    elseif type(tree) == "number" then
        return tree + insert
    elseif side == "left" then
        return {
            left = Day18.insert(tree.left, insert, side),
            right = tree.right
        }
    else
        return {
            left = tree.left,
            right = Day18.insert(tree.right, insert, side)
        }
    end
end

function Day18.explode(tree, depth)
    if depth >= 4 and type(tree) ~= "number" then
        return 0, true, {
            left = tree.left,
            right = tree.right
        }
    elseif type(tree) ~= "number" then
        local explode_left, result, insert = Day18.explode(tree.left, depth + 1)
        if result then
            return {
                left = explode_left,
                right = Day18.insert(tree.right, insert.right, "left")
            }, true, {
                left = insert.left
            }
        else
            local explode_right, result, insert = Day18.explode(tree.right, depth + 1)
            if result then
                return {
                    left = Day18.insert(tree.left, insert.left, "right"),
                    right = explode_right
                }, true, {
                    right = insert.right
                }
            else
                return tree, false, nil
            end
        end
    else
        return tree, false, nil
    end
end

function Day18.split(tree)
    if type(tree) == "number" then
        if tree >= 10 then
            local left = math.floor(tree / 2)
            local right = tree - left
            return {
                left = left,
                right = right
            }, true
        else
            return tree, false
        end
    else
        local left_split, left_result = Day18.split(tree.left)
        if left_result then
            return {
                left = left_split,
                right = tree.right
            }, true
        else
            local right_split, right_result = Day18.split(tree.right)
            if right_result then
                return {
                    left = tree.left,
                    right = right_split
                }, true
            else
                return tree, false
            end
        end
    end
end

function Day18.reduce(tree)
    while true do
        local explode_tree, explode_result = Day18.explode(tree, 0)
        if explode_result then
            tree = explode_tree
        else
            local split_tree, split_result = Day18.split(tree)
            if split_result then
                tree = split_tree
            else
                return tree
            end
        end
    end
end

function Day18.find_magnitude(tree)
    if type(tree) == "number" then
        return tree
    else
        return 3 * Day18.find_magnitude(tree.left) + 2 * Day18.find_magnitude(tree.right)
    end
end

function Day18.find_reduced_mangitude(lines)
    local tree = Day18.parse_tree(lines[1])
    for i = 2, #lines do
        local new_tree = Day18.parse_tree(lines[i])
        tree = {
            left = tree,
            right = new_tree
        }
        tree = Day18.reduce(tree)
    end
    return Day18.find_magnitude(tree)
end

function Day18.find_largest_magnitude(lines)
    local max_magnitude = 0
    for i = 1, #lines do
        for j = 1, #lines do
            if i ~= j then
                local tree = {
                    left = Day18.parse_tree(lines[i]),
                    right = Day18.parse_tree(lines[j])
                }
                tree = Day18.reduce(tree)
                local magnitude = Day18.find_magnitude(tree)
                if magnitude > max_magnitude then
                    max_magnitude = magnitude
                end
            end
        end
    end
    return max_magnitude
end

return Day18
