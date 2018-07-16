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
			SqlConnection conn = new SqlConnection(@"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=Harita;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");
			conn.Open();
			SqlCommand cmd = conn.CreateCommand();

			var function = context.Request.QueryString["f"];
			string mahalleAdi = "";
			string kapiAdi = "";
			string wkt = "";
			string mahalleAdi2 = "";
			string responce = "";
			responce = function + "me-->";
			switch (function)
			{
				case "mahalleekle":
					mahalleAdi = context.Request.QueryString["mahalleAdi"];
					wkt = context.Request.QueryString["WKT"];
					cmd.CommandText = "insert into Mahalle(Mahalleadi,WKT)Values('" + mahalleAdi + "','" + wkt + "')";
					int sonuc = cmd.ExecuteNonQuery();
					if (sonuc > 0)
						responce += "BASARILI";
					else
						responce += "HATALI";
					cmd.Dispose();
					conn.Close();
					break;
				case "kapiekle":
					kapiAdi = context.Request.QueryString["kapiAdi"];
					wkt = context.Request.QueryString["WKT"];
					mahalleAdi2= context.Request.QueryString["mahalleAdi2"];
					cmd.CommandText = "insert into Kapi(Kapiadi,WKT,MahalleAdi)Values('" + kapiAdi + "','" + wkt + "','" + mahalleAdi2 + "')";
					 sonuc = cmd.ExecuteNonQuery();
					if (sonuc > 0)
						responce += "BASARILI";
					else
						responce += "HATALI";
					cmd.Dispose();
					conn.Close();
					break;
				case "mahalleleriGetir":
					cmd.CommandText = "Select * from Mahalle";
					SqlDataAdapter adp = new SqlDataAdapter(cmd);
					DataTable dt = new DataTable("MAHALLELER");
					adp.Fill(dt);
					adp.Dispose();
					cmd.Dispose();
					conn.Close();
					responce = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
					break;
				
				case "kapilariGetir":
					cmd.CommandText = "Select * from Kapi";
					SqlDataAdapter adp1 = new SqlDataAdapter(cmd);
					DataTable dt1 = new DataTable("KAPILAR");
					adp1.Fill(dt1);
					adp1.Dispose();
					cmd.Dispose();
					conn.Close();
					responce = Newtonsoft.Json.JsonConvert.SerializeObject(dt1);
					break;

				case "searchGetir":
					cmd.CommandText = "Select KapiAdi,MahalleAdi,WKT from Kapi ";
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