using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services.Description;

namespace Test2
{
	/// <summary>
	/// Summary description for JsPanelZoom
	/// </summary>
	public class JsPanelZoom : IHttpHandler
	{

		public void ProcessRequest(HttpContext context)
		{
			string wkt = "";
			var function = context.Request.QueryString["s"];
			string responce = "";
			switch (function)
			{
				case "gonder":
					wkt = context.Request.QueryString["wkt"];
					context.Response.Write(wkt);
					break;
				case "al":
					responce = Newtonsoft.Json.JsonConvert.SerializeObject(wkt);
					break;

					default:
				break;

			}

			context.Response.ContentType = "text/plain";
			
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