using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;
using System.Data.Sql;
using System.Web.Services;

namespace Test2
{
    public partial class _Default : Page
    {
        

        protected void Page_Load(object sender, EventArgs e)
        {
            string cs = "data source=.;database=MyDatabase;integrated security=SSPI";
            SqlConnection con = new SqlConnection(cs);
            con.Open();
            Response.Write("<script>alert('Connection opened.');</script>");
            con.Close();
        }
        public void MahalleEkle(string mahalleAdi, string Koordinatlar)
        {

        }
        [WebMethod]
        public static string SaveData(string mahalleAdi,string mahalleNo)
        {
            string status = ""; 
            // apply validation here
            MahalleInfo c = new MahalleInfo {Id=0 , MahalleAdi=mahalleAdi , MahalleNo=mahalleNo };
            //burada databaseimiz bizim dbContext imiz.
            using (MyDatabaseEntities dc =new MyDatabaseEntities())
            {
                dc.MahalleInfo.Add(c);
                dc.SaveChanges();
                status = "success";
               
            }
            return status; 
        }
    }
}