import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// import https from 'https'

// set this to dev server url
//TODO: find a way to do this from cli
const amplipiurl = "http://192.168.0.89/"
// const amplipiurl = "http://192.168.0.117/"
// const amplipiurl = "http://192.168.0.178/"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // plugins: [react(), 'macros'],
  plugins: [react()],
  // 'fontawesome-svg-core': {
  //   license: 'free'
  // },
  server: {
    host: true,
    // https: false,
    proxy: {
      '/api': {
        target: amplipiurl,
        changeOrigin: true,
        // secure: false,
        // agent: new https.Agent()
      },
      '/static': {
        target: amplipiurl,
        changeOrigin: true,
        // secure: false,
        // agent: new https.Agent()
      }
    }
  },
})
