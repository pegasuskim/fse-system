local key = KEYS[1]
local n = 0
for i, a in ipairs(ARGV) do
	n = n + redis.call("sismember", key, a)
end
return n