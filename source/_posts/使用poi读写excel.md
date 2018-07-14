---
title: 使用poi读写excel
date: 2017-10-08 00:17:32
tags: ['java']
---
首先了解以下excel文件怎么和poi中的组件对应起来的。　　
* 一个Excel文件对应于一个Workbook对象
* 一个Workbook可以有多个Sheet对象
* 一个Sheet对象由多个Row对象组成
* 一个Row对象是由多个Cell对象组成 

基于以上几条，如果想对excel文件进行读写的话就要

1. 用Workbook打开或者创建一个Excel文件的对象
2. 用上一步的Excel对象创建或者获取到一个Sheet对象
3. 用Sheet对象创建或获取一个Row对象
4. 用Row对象创建或获取一个Cell对象
5. 对Cell对象读写。

基于以上原理就可以轻松对Excel文件进行读写，这里以XSSFWorkbook（对应.xlsx文件即office2007以上版本，如果是.xls文件即office2003以下版本需要使用HSSFWorkbook）为例进行Excel的简单读写。
maven依赖
```
         <!-- https://mvnrepository.com/artifact/org.apache.poi/poi -->
         <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi</artifactId>
            <version>3.17-beta1</version>
        </dependency>


        <!-- https://mvnrepository.com/artifact/org.apache.poi/poi-ooxml -->
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>3.16-beta1</version>
        </dependency>

```
写操作
```
        //创建一个Excel对象
        XSSFWorkbook wb = new XSSFWorkbook();

        //创建表单Sheet对象
        XSSFSheet sheet = wb.createSheet();

        //创建Row对象
        XSSFRow row1 = sheet.createRow(0);
        XSSFRow row2 = sheet.createRow(1);
        XSSFRow row3 = sheet.createRow(2);

        //创建Cell对象，并进行写操作

        //第一行
        XSSFCell cell1 =  row1.createCell(0);
        cell1.setCellValue("姓名");
        XSSFCell cell2 =  row1.createCell(1);
        cell2.setCellValue("年龄");

        //第二行
        cell1 =  row2.createCell(0);
        cell1.setCellValue("张三");
        cell2 =  row2.createCell(1);
        cell2.setCellValue("20");

        //第三行
        cell1 =  row3.createCell(0);
        cell1.setCellValue("李四");
        cell2 =  row3.createCell(1);
        cell2.setCellValue("18");

        //输出文件
        FileOutputStream output = new FileOutputStream("test.xlsx");
        wb.write(output);
        output.flush();
```

![image.png](/img/8297579-5e28e732a563bc53.png)

读操作和写操作类似，把create的地方换成get即可
```
        //获取Excel对象
        XSSFWorkbook wb = new XSSFWorkbook(new FileInputStream("test.xlsx"));

        //获取一个Sheet对象
        XSSFSheet sheet = wb.getSheetAt(0);

        //获取Row对象
        XSSFRow row1 = sheet.getRow(0);
        XSSFRow row2 = sheet.getRow(1);
        XSSFRow row3 = sheet.getRow(2);

        //获取Cell对象的值并输出
        System.out.println(row1.getCell(0) + " " + row1.getCell(1));
        System.out.println(row2.getCell(0) + " " + row2.getCell(1));
        System.out.println(row3.getCell(0) + " " + row3.getCell(1));
```

![image.png](/img/8297579-2024e73c2e8adf72.png)

当然也可以根据文件扩展名自动选择使用哪个子类生成Workbook对象，这里直接封一个util工具类，方便以后直接使用
```
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class ReadExcelUtils {

    private Logger logger = LoggerFactory.getLogger(ReadExcelUtils.class);

    private Workbook wb;
    private Sheet sheet;
    private Row row;

    public ReadExcelUtils(String filepath) {
        if(filepath==null){
            return;
        }
        String ext = filepath.substring(filepath.lastIndexOf("."));
        try {
            InputStream is = new FileInputStream(filepath);
            if(".xls".equals(ext)){
                wb = new HSSFWorkbook(is);
            }else if(".xlsx".equals(ext)){
                wb = new XSSFWorkbook(is);
            }else{
                wb=null;
            }
        } catch (FileNotFoundException e) {
            logger.error("FileNotFoundException", e);
        } catch (IOException e) {
            logger.error("IOException", e);
        }
    }


    /**
     * 读取Excel表格表头的内容
     * @return String 表头内容的数组
     */
    public String[] readExcelTitle() throws Exception{
        if(wb==null){
            throw new Exception("Workbook对象为空！");
        }
        sheet = wb.getSheetAt(0);
        row = sheet.getRow(0);
        // 标题总列数
        int colNum = row.getPhysicalNumberOfCells();

        String[] title = new String[colNum];
        for (int i = 0; i < colNum; i++) {
            // title[i] = getStringCellValue(row.getCell((short) i));
            title[i] = row.getCell(i).getStringCellValue();
        }
        return title;
    }

    /**
     * 读取Excel数据内容
     * @return Map 包含单元格数据内容的Map对象
     */
    public Map<Integer, Map<Integer,Object>> readExcelContent() throws Exception{
        if(wb==null){
            throw new Exception("Workbook对象为空！");
        }
        Map<Integer, Map<Integer,Object>> content = new HashMap<Integer, Map<Integer,Object>>();

        sheet = wb.getSheetAt(0);
        // 得到总行数
        int rowNum = sheet.getLastRowNum();
        row = sheet.getRow(0);
        int colNum = row.getPhysicalNumberOfCells();

        // 正文内容应该从第二行开始,第一行为表头的标题
        for (int i = 1; i <= rowNum; i++) {
            row = sheet.getRow(i);
            int j = 0;
            Map<Integer,Object> cellValue = new HashMap<Integer, Object>();
            while (j < colNum) {
                Object obj = getCellFormatValue(row.getCell(j));
                cellValue.put(j, obj);
                j++;
            }
            content.put(i, cellValue);
        }
        return content;
    }

    /**
     * 根据Cell类型设置数据
     * @param cell
     * @return Object
     */
    private Object getCellFormatValue(Cell cell) {
        Object cellvalue = "";
        if (cell != null) {

            // 判断当前Cell的Type
            switch (cell.getCellType()) {
                case Cell.CELL_TYPE_NUMERIC:// 如果当前Cell的Type为NUMERIC
                case Cell.CELL_TYPE_FORMULA: {
                    // 判断当前的cell是否为Date
                    if (DateUtil.isCellDateFormatted(cell)) {
                        // 如果是Date类型则，转化为Data格式
                        // data格式是带时分秒的：2013-7-10 0:00:00
                        // cellvalue = cell.getDateCellValue().toLocaleString();


                        // data格式是不带带时分秒的：2013-7-10
                        Date date = cell.getDateCellValue();
                        cellvalue = date;
                    } else {
                        // 如果是纯数字
                        // 取得当前Cell的数值
                        cellvalue = String.valueOf(cell.getNumericCellValue());
                    }
                    break;
                }
                case Cell.CELL_TYPE_STRING:// 如果当前Cell的Type为STRING
                    // 取得当前的Cell字符串
                    cellvalue = cell.getRichStringCellValue().getString();
                    break;
                default:// 默认的Cell值
                    cellvalue = "";
            }
        } else {
            cellvalue = "";
        }
        return cellvalue;
    }
    
}
```
