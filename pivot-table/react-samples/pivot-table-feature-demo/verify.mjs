import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir(new URL('./artifacts/', import.meta.url), { recursive: true });
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:720}});
page.setDefaultTimeout(15000);
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try {
 await page.goto('http://127.0.0.1:5173');
 const pivot=page.locator('#sales-pivot');
 await pivot.locator('.e-valuescontent').first().waitFor();
 const text=await pivot.innerText();
 for(const value of ['$139,728','82','$1,704.00','$272,328','160','$1,702.05']) assert.ok(text.includes(value),value);
 await page.screenshot({path:'artifacts/pivot-table-sales-report.png',fullPage:true,animations:'disabled'});
 await page.getByRole('button',{name:'Field List',exact:true}).click();
 const fieldList=page.locator('[role="dialog"]:visible').filter({hasText:'All Fields'});
 await fieldList.waitFor();
 await page.waitForTimeout(500);
 await page.screenshot({path:'artifacts/pivot-table-field-list.png',fullPage:true,animations:'disabled'});
 await page.locator('#sales-pivot_PivotFieldList_CalculatedField').click();
 await page.locator('[id$=calculateddialog]:visible').waitFor();
 await page.keyboard.press('Escape');
 await page.reload();await pivot.locator('.e-valuescontent').first().waitFor();
 // Exercise drag with pointer events rather than calling the handler directly.
 const source=await page.locator('#sales-pivot_amount .e-pvt-btn-content').boundingBox();
 const target=await page.locator('#sales-pivot .e-group-columns').boundingBox();
 await page.mouse.move(source.x+source.width/2,source.y+source.height/2);
 await page.mouse.down();await page.mouse.move(source.x+10,source.y+10,{steps:5});
 await page.mouse.move(target.x+target.width-30,target.y+target.height/2,{steps:30});await page.mouse.up();
 assert.equal(await page.locator('#sales-pivot .e-group-values [data-uid="amount"]').count(),1);
 assert.equal(await page.locator('#sales-pivot .e-group-columns [data-uid="amount"]').count(),0);
 await pivot.locator('.e-valuescontent').filter({hasText:'$139,728'}).first().dblclick();
 const detail=page.locator('[role="dialog"]:visible').filter({hasText:'Details'});
 await detail.waitFor();await page.waitForTimeout(500);const detailText=await detail.innerText();
 for(const value of ['France','Bikes','Accessories','$52,824','$86,904'])assert.ok(detailText.includes(value),value);
 await page.screenshot({path:'artifacts/pivot-table-drill-through.png',fullPage:true,animations:'disabled'});
 assert.equal(errors.length,0,errors.join('\n'));
 const result={date:new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()),browser:browser.version(),checks:['initial totals and calculated measure','Field List opens','calculated-field dialog opens','Revenue remains in values after drag toward columns','drill-through shows two contributing rows'],pageErrors:errors,license:'No key supplied; trial notice visible. No licensing credentials included.'};
 await writeFile('verification.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
} finally {await browser.close();}
