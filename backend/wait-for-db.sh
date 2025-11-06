#!/bin/sh
# wait-for-db.sh - 等待PostgreSQL数据库就绪

set -e

host="$1"
shift
cmd="$@"

echo "⏳ 等待数据库 $host 就绪..."

until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$host" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
  echo "⏳ 数据库未就绪，等待中..."
  sleep 2
done

echo "✅ 数据库已就绪！"

exec $cmd
