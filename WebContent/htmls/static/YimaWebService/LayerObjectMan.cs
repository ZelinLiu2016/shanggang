using System;
using System.Data;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using System.Data.OleDb;

namespace YimaWebService
{
    public class LayerObjectMan
    {
        /// <summary>
        /// 添加一个图层
        /// </summary>
        /// <param name="strLayerName">图层名称(string)</param>
        /// <param name="iLayerType">图层类型(int):1=点图层、2=线图层、3=面图层</param>
        /// <param name="iIsShowOrNot">图层是否显示(int):1=显示，0=隐藏</param>
        /// <param name="strContent">备注(string)</param>
        /// <returns></returns>
        public static int AddNewLayer(string strLayerName,int iLayerType,int iIsShowOrNot,string strContent)
        { 
            int iPointServerId = -1;
            string strSql = "insert into LayerTable(iObjLayerId,strObjName,strObjContent,strObjGeo,dtObjDate,strCompany,iObjStyleId,strObjImgUrl,iObjImgWidth,iObjImgHeight)values(@objLayerId,@objName,@objContent,@objGeo,@objDate,@company,@objStyleId,@objImgUrl,@objImgWidth,@objImgHeight)";
            string strConn = YimaDataBase.GetSqlConnectionString();

            using (OleDbConnection conn = new OleDbConnection(strConn))
            {
                using (OleDbCommand cmd = new OleDbCommand(strSql, conn))
                {
                    cmd.Parameters.Add("objLayerId", OleDbType.Integer);
                    cmd.Parameters["objLayerId"].Value = Convert.ToInt32(objLayerId);

                    cmd.Parameters.Add("objName", OleDbType.VarChar, 50);
                    cmd.Parameters["objName"].Value = objName;

                    cmd.Parameters.Add("objContent", OleDbType.VarChar, 100);
                    cmd.Parameters["objContent"].Value = objContent;
                }
            }
        }
    }
}
