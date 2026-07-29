const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const directoriesToScan = [
    path.join(__dirname, 'IMG'),
    path.join(__dirname, 'assets', 'img'),
    path.join(__dirname, 'dist', 'assets', 'img')
];

async function optimizeImages() {
    console.log('Iniciando otimização de imagens...');
    
    for (const dir of directoriesToScan) {
        if (!fs.existsSync(dir)) {
            continue;
        }
        
        console.log(`\nVerificando diretório: ${dir}`);
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            const fullPath = path.join(dir, file);
            
            // Pular diretórios e focar apenas em JPG/PNG
            if (!fs.statSync(fullPath).isFile() || !['.jpg', '.jpeg', '.png'].includes(ext)) {
                continue;
            }
            
            const webpPath = path.join(dir, `${path.basename(file, ext)}.webp`);
            
            try {
                const originalSize = fs.statSync(fullPath).size;
                
                // Converte e otimiza para WebP
                await sharp(fullPath)
                    .webp({ quality: 80 })
                    .toFile(webpPath);
                    
                const newSize = fs.statSync(webpPath).size;
                const saved = ((originalSize - newSize) / originalSize * 100).toFixed(1);
                
                console.log(`✅ Otimizada: ${file}`);
                console.log(`   Tamanho original: ${(originalSize / 1024).toFixed(1)} KB`);
                console.log(`   Novo tamanho (WebP): ${(newSize / 1024).toFixed(1)} KB (-${saved}%)`);
            } catch (err) {
                console.error(`❌ Erro ao otimizar ${file}:`, err.message);
            }
        }
    }
    
    console.log('\nProcesso de otimização concluído!');
    console.log('Lembre-se de atualizar as referências HTML para usar as imagens .webp.');
}

optimizeImages();
