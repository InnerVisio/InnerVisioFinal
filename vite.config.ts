import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// Custom plugin to ensure folders from either root or public are copied to dist
const copyRootFoldersPlugin = () => {
  return {
    name: 'copy-root-folders',
    closeBundle() {
      const foldersToCopy = [
        '2DPudorysy',
        '3DPudorys',
        'Banner',
        'Bludovice',
        'Exterier',
        'Exteriér',
        'exterier',
        'HeroSection',
        'Lipence',
        'RezidenceHorska',
        'VizualizaceBludovice',
        'VizualizaceExterieruNaPrazdnemPozemku',
        'VizualizaceExterieruSkorkov',
        'VizualizaceExterieruTran',
        'VizualizaceInterieru3',
        'VizualizaceKancelare'
      ];

      const outDir = path.resolve(process.cwd(), 'dist');

      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }

      function copyDirRecursiveSync(src: string, dest: string) {
        if (!fs.existsSync(src)) return;
        const stats = fs.statSync(src);
        if (stats.isDirectory()) {
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
          fs.readdirSync(src).forEach((childItemName) => {
            copyDirRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
          });
        } else {
          fs.copyFileSync(src, dest);
        }
      }

      for (const folder of foldersToCopy) {
        // Try copying from root if it exists there
        const rootPath = path.resolve(process.cwd(), folder);
        if (fs.existsSync(rootPath) && fs.statSync(rootPath).isDirectory()) {
          console.log(`[Vite Build Plugin] Copying root folder "${folder}" to dist/`);
          const destPath = path.resolve(outDir, folder);
          copyDirRecursiveSync(rootPath, destPath);

          // If the folder is any variation of Exterier/Exteriér/exterier, duplicate for Netlify path safety
          if (folder.toLowerCase().includes('exterier') || folder.includes('Exteriér')) {
            copyDirRecursiveSync(rootPath, path.resolve(outDir, 'Exterier'));
            copyDirRecursiveSync(rootPath, path.resolve(outDir, 'Exteriér'));
            copyDirRecursiveSync(rootPath, path.resolve(outDir, 'exterier'));
          }
        }

        // Try copying from public if it exists there
        const publicPath = path.resolve(process.cwd(), 'public', folder);
        if (fs.existsSync(publicPath) && fs.statSync(publicPath).isDirectory()) {
          console.log(`[Vite Build Plugin] Copying public folder "${folder}" to dist/`);
          const destPath = path.resolve(outDir, folder);
          copyDirRecursiveSync(publicPath, destPath);

          // If the folder is any variation of Exterier/Exteriér/exterier, duplicate for Netlify path safety
          if (folder.toLowerCase().includes('exterier') || folder.includes('Exteriér')) {
            copyDirRecursiveSync(publicPath, path.resolve(outDir, 'Exterier'));
            copyDirRecursiveSync(publicPath, path.resolve(outDir, 'Exteriér'));
            copyDirRecursiveSync(publicPath, path.resolve(outDir, 'exterier'));
          }
        }
      }

      // Also handle FavIcon.png, InnerUvod.png, robots.txt, sitemap.xml, 101-Exterier.jpg
      const filesToCopy = ['FavIcon.png', 'InnerUvod.png', 'robots.txt', 'sitemap.xml', '101-Exterier.jpg'];
      for (const file of filesToCopy) {
        const rootFilePath = path.resolve(process.cwd(), file);
        if (fs.existsSync(rootFilePath)) {
          console.log(`[Vite Build Plugin] Copying root file "${file}" to dist/`);
          fs.copyFileSync(rootFilePath, path.resolve(outDir, file));
        }
        
        const publicFilePath = path.resolve(process.cwd(), 'public', file);
        if (fs.existsSync(publicFilePath)) {
          console.log(`[Vite Build Plugin] Copying public file "${file}" to dist/`);
          fs.copyFileSync(publicFilePath, path.resolve(outDir, file));
        }
      }
    }
  };
};

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), copyRootFoldersPlugin()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
