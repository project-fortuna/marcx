echo Updating $1 version

update_type=$1

# Get the old version from the manifest
version=$(grep -Po '(?<="version": ")[^"]*' extension/public/manifest.json)
echo Old version: $version

# Update the version number based on the update type (major/minor/patch)
IFS='.' read -r -a version_parts <<<"$version"
major=${version_parts[0]}
minor=${version_parts[1]}
patch=${version_parts[2]}

if [ "$update_type" == "major" ]; then
    major=$((major + 1))
    minor=0
    patch=0
elif [ "$update_type" == "minor" ]; then
    minor=$((minor + 1))
    patch=0
elif [ "$update_type" == "patch" ]; then
    patch=$((patch + 1))
else
    echo "Invalid update type."
    exit 1
fi

# Concatenate the updated components to form the new version number
updated="$major.$minor.$patch"

echo New version: $updated

echo Checking out release branch...
git checkout -b release-$updated develop

# Update the version number in the manifest file
echo Updating Chrome extension manifest...
sed -i s/'"version": ".*"'/'"version": "'$updated'"'/g extension/public/manifest.json

# Finally update the package version and push
cd extension/
npm version $1

cd ..
npm version $1 --force
