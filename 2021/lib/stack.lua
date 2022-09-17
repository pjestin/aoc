local Stack = {}

function Stack:new(o)
    o = o or {
        data = {}
    }
    setmetatable(o, self)
    self.__index = self
    return o
end

function Stack:to_string()
    return table.concat(self.data, ", ")
end

function Stack:push(o)
    table.insert(self.data, o)
end

function Stack:pop()
    local last = self.data[#self.data]
    self.data[#self.data] = nil
    return last
end

function Stack:is_empty()
    return #self.data == 0
end

return Stack
