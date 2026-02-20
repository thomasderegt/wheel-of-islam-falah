#!/usr/bin/env sh
# Verhoog file descriptor limit (voorkomt EMFILE bij file watching op macOS)
ulimit -n 10240 2>/dev/null || ulimit -n 8192 2>/dev/null || true
# Force polling i.p.v. native watchers → voorkomt EMFILE op macOS/Cursor
export WATCHPACK_POLLING=true
exec npx next dev -p 3000 -H 127.0.0.1 "$@"
