using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Web.Services;

namespace Test2
{
    public partial class _Default : Page
    {
        

        protected void Page_Load(object sender, EventArgs e)
        {

        }
        public void MahalleEkle(string mahalleAdi, string Koordinatlar)
        {

        }
        [WebMethod]
        public void SaveData(string mahalleAdi,string mahalleNo)
        {
            
            // apply validation here
            MahalleInfo c = new MahalleInfo {Id=0 , MahalleAdi=mahalleAdi , MahalleNo=mahalleNo };
            //burada databaseimiz bizim dbContext imiz.
            using (MyDatabaseEntities dc =new MyDatabaseEntities())
            {
                dc.MahalleInfo.Add(c);
                dc.SaveChanges();
               
            }
            
        }
    }
}