using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;
using System.Configuration;

namespace Test2
{
	public partial class Test2 : System.Web.UI.Page
	{
		public string txtMahalleAdi;

		protected void Page_Load(object sender, EventArgs e)
        {

			if (IsPostBack)
			{
				SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString);
				connection.Open();
				string sql = "insert into Database1(mahalleId,mahalleName) values (1," + txtMahalleAdi + ")";

			}
		}


		

	}
}