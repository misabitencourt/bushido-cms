
export default accept => new Promise((resolve, reject) => {
    accept = accept || '*';
    const inputFile = document.createElement('input');
    
    inputFile.type = 'file';
    inputFile.style.position = 'absolute';
    inputFile.style.top = '-100px';
    document.body.appendChild(inputFile);
    inputFile.addEventListener('change', e => {
        const file = e.target.files[0];        
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
    });

    inputFile.accept = accept || '';
    inputFile.multiple = false;
    inputFile.click();
});