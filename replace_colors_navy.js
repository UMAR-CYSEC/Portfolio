const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// Update :root variables
css = css.replace(/:root {[\s\S]*?}/, `:root {
  --primary: #D4AF37;
  --primary-dark: #B5952F;
  --primary-light: rgba(212, 175, 55, 0.15);
  --primary-glow: rgba(212, 175, 55, 0.3);
  --accent: #E5C158;
  --bg-white: #0A192F;
  --bg-light: #020C1B;
  --bg-dark: #010610;
  --text-dark: #E6F1FF;
  --text-medium: #8892B0;
  --text-light: #6B7A9A;
  --text-white: #FFFFFF;
  --border: #233554;
  --shadow: 0 4px 6px -1px rgba(2,12,27,0.7), 0 2px 4px -2px rgba(2,12,27,0.7);
  --shadow-lg: 0 20px 25px -5px rgba(2,12,27,0.7), 0 8px 10px -6px rgba(2,12,27,0.7);
  --shadow-blue: 0 10px 40px -10px rgba(212, 175, 55, 0.3);
  --radius: 12px;
  --radius-lg: 20px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}`);

// Fix navbar scrolled background (using navy background)
css = css.replace(/background-color:\s*rgba\(5,\s*5,\s*5,\s*0\.9\);/g, 'background-color: rgba(10, 25, 47, 0.9);');

// Fix mobile nav overlay background
css = css.replace(/background-color:\s*rgba\(5,\s*5,\s*5,\s*0\.95\);/g, 'background-color: rgba(10, 25, 47, 0.95);');

// Fix footer socials hover
css = css.replace(/rgba\(0,\s*240,\s*255,\s*0\.1\)/g, 'rgba(212, 175, 55, 0.1)');

// Fix project glow inset shadow
css = css.replace(/rgba\(0,\s*240,\s*255,\s*0\.3\)/g, 'rgba(212, 175, 55, 0.3)');

fs.writeFileSync('style.css', css, 'utf8');
console.log('Colors updated to Navy & Gold.');
