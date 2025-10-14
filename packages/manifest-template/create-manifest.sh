#!/bin/bash

# Usage: ./create-manifest.sh manifest-multi-tenant

# Exit on error
set -e

ProjectName=$1
if [ -z "$ProjectName" ]; then
  echo "❌ Project name is required."
  echo "Usage: $0 <project-name>"
  exit 1
fi
echo "📁 Creating project: $ProjectName"

# Spinner Function
spin() {
  local pid=$1
  local message=$2
  local sp='/-\|'
  local i=0
  while kill -0 "$pid" 2>/dev/null; do
    i=$(( (i+1) %4 ))
    printf "\r$message ${sp:$i:1}"
    sleep 0.1
  done
  printf "\r✅ $message done!\n"
}

# Step-1: Clone Template
echo -n "🧬 Cloning project template...."
CLONE_OUT=$(mktemp)

pnpm --silent dlx giget@latest gh:Us3r-gitHub/manifest/packages/manifest-template/multi-tenant#multi-tenant-local "$ProjectName" > "$CLONE_OUT" 2>&1 &
CLONE_PID=$!
spin $CLONE_PID "🧬 Cloning project template"

if [ -s "$CLONE_OUT" ]; then
  awk 'NF' "$CLONE_OUT"
fi
rm "$CLONE_OUT"

# Step-2: Move to Project Directory
cd "$ProjectName"

# Step-3: Update .gitignore to ignore .env file
echo "\n\n# Env\n.env" >> .gitignore

# Step-4: Generate and set TOKEN_SECRET_KEY in .env
TOKEN_SECRET_KEY=$(openssl rand -hex 32)
if grep -q "^TOKEN_SECRET_KEY=" .env; then
  sed -i.bak "s/^TOKEN_SECRET_KEY=.*/TOKEN_SECRET_KEY=$TOKEN_SECRET_KEY/" .env && rm .env.bak
  echo "🔐 Updated TOKEN_SECRET_KEY in .env"
else
  echo "TOKEN_SECRET_KEY=$TOKEN_SECRET_KEY" >> .env
  echo "🔐 Added TOKEN_SECRET_KEY to .env"
fi

# Step-5: Update `name` in package.json
sed -i.bak "s/\"name\": \".*\"/\"name\": \"$ProjectName\"/" package.json && rm package.json.bak
echo "📝 Updated package name in package.json"

# Step-6: Install Packages
echo -n "📦 Installing dependencies...."
pnpm --silent install &
INSTALL_PID=$!
spin $INSTALL_PID "📦 Installing dependencies"

# Step-7: Run Server
echo "🚀 Starting server"
pnpm start