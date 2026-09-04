using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.IO;
using System.Net;
using System.Text.Json;

namespace PivotController.Controllers
{
    public class DataSource
    {

        public class PivotCSVData
        {
            public string Region { get; set; }
            public string Country { get; set; }
            public string ItemType { get; set; }
            public string SalesChannel { get; set; }
            public string OrderPriority { get; set; }
            public string OrderDate { get; set; }
            public int OrderID { get; set; }
            public string ShipDate { get; set; }
            public int UnitsSold { get; set; }
            public double UnitPrice { get; set; }
            public double UnitCost { get; set; }
            public double TotalRevenue { get; set; }
            public double TotalCost { get; set; }
            public double TotalProfit { get; set; }


            public List<string[]> ReadCSVData(string url)
            {
                List<string[]> data = new List<string[]>();
                using (StreamReader reader = new StreamReader(new WebClient().OpenRead(url)))
                {
                    string line;
                    while ((line = reader.ReadLine()) != null)
                    {
                        line = line.Trim();

                        if (!string.IsNullOrWhiteSpace(line))
                        {
                            data.Add(line.Split(','));
                        }
                    }
                    return data;
                }
            }
        }

        public class PivotJSONData
        {
            public string Date { get; set; }
            public string Sector { get; set; }
            public string EnerType { get; set; }
            public string EneSource { get; set; }
            public int PowUnits { get; set; }
            public int ProCost { get; set; }


            public List<PivotJSONData> ReadJSONData(string url)
            {
                WebClient myWebClient = new WebClient();
                Stream myStream = myWebClient.OpenRead(url);
                StreamReader stream = new StreamReader(myStream);
                string result = stream.ReadToEnd();
                stream.Close();
                return Newtonsoft.Json.JsonConvert.DeserializeObject<List<PivotJSONData>>(result);
            }
        }

        public class PivotViewData
        {
            public string ProductID { get; set; }
            public string Country { get; set; }
            public string Product { get; set; }
            public double Sold { get; set; }
            public double Price { get; set; }
            public string Year { get; set; }

            public List<PivotViewData> GetVirtualData()
            {
                List<PivotViewData> VirtualData = new List<PivotViewData>();

                for (int i = 1; i <= 500000; i++)
                {
                    PivotViewData p = new PivotViewData
                    {
                        ProductID = "PRO-" + (500000 + (i % 20000)),
                        Year = (new string[] { "FY 2015", "FY 2016", "FY 2017", "FY 2018", "FY 2019" })[new Random().Next(5)],
                        Country = (new string[] { "Canada", "France", "Australia", "Germany", "France" })[new Random().Next(5)],
                        Product = (new string[] { "Car", "Van", "Bike", "Flight", "Bus" })[new Random().Next(5)],
                        Price = (3.4 * i) + 500,
                        Sold = (i * 15) + 10
                    };
                    VirtualData.Add(p);
                }
                return VirtualData;
            }
        }

        public class BusinessObjectsDataView
        {
            public DataTable GetDataTable()
            {
                DataTable dt = new DataTable("BusinessObjectsDataTable");
                PropertyDescriptorCollection pdc = TypeDescriptor.GetProperties(typeof(PivotViewData));
                foreach (PropertyDescriptor pd in pdc)
                {
                    dt.Columns.Add(new DataColumn(pd.Name, pd.PropertyType));
                }
                List<PivotViewData> list = new PivotViewData().GetVirtualData();
                foreach (PivotViewData bo in list)
                {
                    DataRow dr = dt.NewRow();
                    foreach (PropertyDescriptor pd in pdc)
                    {
                        dr[pd.Name] = pd.GetValue(bo);
                    }
                    dt.Rows.Add(dr);
                }
                return dt;
            }
        }
    }
}
