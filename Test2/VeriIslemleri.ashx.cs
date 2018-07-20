using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace Test2
{
	/// <summary>
	/// Summary description for VeriIslemleri
	/// </summary>
	public class VeriIslemleri : IHttpHandler
	{

		public void ProcessRequest(HttpContext context)
		{
			SqlConnection conn = new SqlConnection(@"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=Map;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");
			conn.Open();
			SqlCommand cmd = conn.CreateCommand();

			var function = context.Request.QueryString["f"];
			string districtName = "";
			string doorName = "";
			string wkt = "";
			string districtName2 = "";
			string responce = "";
			responce = function + "-->";
			switch (function)
			{
				case "adddistrict":
					districtName = context.Request.QueryString["districtName"];
					wkt = context.Request.QueryString["WKT"];
					cmd.CommandText = "insert into District(DistrictName,WKT)Values('" + districtName + "','" + wkt + "')";
					int result = cmd.ExecuteNonQuery();
					if (result > 0)
						responce += "Success";
					else
						responce += "Error";
					cmd.Dispose();
					conn.Close();
					break;
				case "adddoor":
					doorName = context.Request.QueryString["doorName"];
					wkt = context.Request.QueryString["WKT"];
					districtName2= context.Request.QueryString["districtName2"];
					cmd.CommandText = "insert into Door(DoorName,WKT,DistrictName)Values('" + doorName + "','" + wkt + "','" + districtName2 + "')";
					 result = cmd.ExecuteNonQuery();
					if (result > 0)
						responce += "Success";
					else
						responce += "Error";
					cmd.Dispose();
					conn.Close();
					break;
				case "bringDistricts":
					cmd.CommandText = "Select * from District";
					SqlDataAdapter adp = new SqlDataAdapter(cmd);	
					DataTable dt = new DataTable("DISTRICTS");
					adp.Fill(dt);
					adp.Dispose();
					cmd.Dispose();
					conn.Close();
					responce = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
					break;
				
				case "bringDoors":
					cmd.CommandText = "Select * from Door";
					SqlDataAdapter adp1 = new SqlDataAdapter(cmd);
					DataTable dt1 = new DataTable("DOORS");
					adp1.Fill(dt1);
					adp1.Dispose();
					cmd.Dispose();
					conn.Close();
					responce = Newtonsoft.Json.JsonConvert.SerializeObject(dt1);
					break;

				case "searchBring":
					cmd.CommandText = "Select DoorName,DistrictName,WKT from Door ";
					SqlDataAdapter adp2 = new SqlDataAdapter(cmd);
					DataTable dt2 = new DataTable("SEARCH");
					adp2.Fill(dt2);
					adp2.Dispose();
					cmd.Dispose();
					conn.Close();
					responce = Newtonsoft.Json.JsonConvert.SerializeObject(dt2);
					break;
				default:
					break;
			}
			context.Response.ContentType = "text/html";
			context.Response.Write(responce);
		}

		public bool IsReusable
		{
			get
			{
				return false;
			}
		}
	}
}