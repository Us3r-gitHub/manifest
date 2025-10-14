module.exports = {
  apps: [
    {
      name: 'manifest-multi-tenant',
      script: './node_modules/manifest/dist/manifest/src/main.js',
      ignore_watch: [
        '*.lock',
        '**/*.lock',
        '*.db',
        '**/*.db',
        '*.db-journal',
        '**/*.db-journal'
      ],
      watch: ['manifests/**/manifest.yml', 'manifests/**/handlers/*.js']
    }
  ]
}
