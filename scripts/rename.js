const fs = require('fs');
let baseDir = 'source/img/cover/'
let indexArr = [];

fs.readdir(baseDir, (err, files) => {

    // 已经命名过的数量
    let hasNameNum = 0;
    // 找到目前最大的index
    files.forEach((file) => {

        // 以前已经命名过的
        let covered = file.match(/cover-\d+/);
        if (covered) {
            indexArr.push(Number(covered[0].match(/\d+/)[0]));
            ++hasNameNum;
        }
    })

    // 如果存在没有命名的
    if (hasNameNum !== files.length) {
        indexArr.sort((a, b) => ( a - b ));
        let index = 0;

        let k = 0; // 已经命名数组的下标
        while (files.length > hasNameNum) {
            files.forEach((file) => {
                if (!file.startsWith('cover') && !file.endsWith('.js')) {
                    index++;
                    if (indexArr[k] && index < indexArr[k]) {
                        console.log(index);
                        fs.rename(baseDir + file, `${baseDir}cover-${index}`, () => { });
                        hasNameNum++;
                    } else if (indexArr[k]) {
                        k++;
                    } else {
                        fs.rename(baseDir + file, `${baseDir}cover-${index}`, () => {});
                        hasNameNum++;
                    
                    }
                }
            })
        }
    }
})