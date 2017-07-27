using System;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Xml.Linq;
using System.Data.OleDb;
using System.IO;
using YIMAENCSVRLIBLib;

namespace YimaWebService
{
    /// <summary>
    /// Service1 的摘要说明
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [ToolboxItem(false)]
    // 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消对下行的注释。
    [System.Web.Script.Services.ScriptService]
    
    public class Service1 : System.Web.Services.WebService
    {

        [WebMethod]
        public string HelloWorld()
        {
            return "HelloWorld";
        }

        [WebMethod]
        public string GetImg()
        {
            return "HelloWorld";
        }

        [WebMethod]
        public string GetString(string str)
        {
            return "Input String is '" + str + "'";
        }

        [WebMethod]
        public int Num(int num1,int num2)
        {
            return num1 + num2;
        }

        #region 物标接口
        /// <summary>
        /// 获取所有物标信息
        /// </summary>
        /// <returns>返回物标的信息，json格式数据:{strServerId,strObjLayerId,strObjName,strObjContent,strObjGeo,strObjDate,strObjStyleId,strObjImgUrl,strObjImgWidth,strObjImgHeight}</returns>
        [WebMethod]
        public string API_GetAllObjectInfoFromData()
        {
            string strObjInfo = "";


            string strSql = "select id,iObjLayerId,strObjName,strObjContent,strObjGeo,dtObjDate,strCompany,iObjStyleId,strObjImgUrl,iObjImgWidth,iObjImgHeight from ObjTable order by iObjLayerId ";
            string strConn = YimaDataBase.GetSqlConnectionString();
            DataSet ds = YimaDataBase.ExecuteSqlReDataSet(strSql, strConn);
            int iObjCount = ds.Tables[0].Rows.Count;
            JSONHelper jsonHelper = new JSONHelper();
            for (int i = 0; i < iObjCount; i++)
            {
                string strServerId = ds.Tables[0].Rows[i]["id"].ToString();
                string strObjLayerId = ds.Tables[0].Rows[i]["iObjLayerId"].ToString();
                string strObjName = ds.Tables[0].Rows[i]["strObjName"].ToString();
                string strObjContent = ds.Tables[0].Rows[i]["strObjContent"].ToString();
                string strObjGeo = ds.Tables[0].Rows[i]["strObjGeo"].ToString();
                string strObjDate = ds.Tables[0].Rows[i]["dtObjDate"].ToString();
                string strCompany = ds.Tables[0].Rows[i]["strCompany"].ToString();
                string strObjStyleId = ds.Tables[0].Rows[i]["iObjStyleId"].ToString();
                string strObjImgUrl = ds.Tables[0].Rows[i]["strObjImgUrl"].ToString();
                string strObjImgWidth = ds.Tables[0].Rows[i]["iObjImgWidth"].ToString();
                string strObjImgHeight = ds.Tables[0].Rows[i]["iObjImgHeight"].ToString();

                jsonHelper.AddItem("strServerId", strServerId);
                jsonHelper.AddItem("strObjLayerId", strObjLayerId);
                jsonHelper.AddItem("strObjName", strObjName);
                jsonHelper.AddItem("strObjContent", strObjContent);
                jsonHelper.AddItem("strObjGeo", strObjGeo);
                jsonHelper.AddItem("strObjDate", strObjDate);
                jsonHelper.AddItem("strObjStyleId", strObjStyleId);
                jsonHelper.AddItem("strObjImgUrl", strObjImgUrl);
                jsonHelper.AddItem("strObjImgWidth", strObjImgWidth);
                jsonHelper.AddItem("strObjImgHeight", strObjImgHeight);
                jsonHelper.ItemOk();
            }


            strObjInfo = jsonHelper.ToString();

            return strObjInfo;
        }

        /// <summary>
        /// 从数据库中根据物标的id获取点物标图片的尺寸
        /// </summary>
        /// <param name="iObjServerId">物标的id</param>
        /// <returns>返回点图片的尺寸:格式是json格式{objImgWidth,objImgHeight}</returns>
        [WebMethod]
        public string API_GetPointObjectImgSizeFromData(int iObjServerId)
        {
            string strObjInfo = "";
            JSONHelper jsonHelper = new JSONHelper();

            string strSql = "select iObjImgWidth,iObjImgHeight from ObjTable where id = " + iObjServerId.ToString();
            string strConn = YimaDataBase.GetSqlConnectionString();
            DataSet ds = YimaDataBase.ExecuteSqlReDataSet(strSql, strConn);
            int iObjCount = ds.Tables[0].Rows.Count;


            if (iObjCount > 0)
            {
                string objImgWidth = ds.Tables[0].Rows[0]["iObjImgWidth"].ToString();
                string objImgHeight = ds.Tables[0].Rows[0]["iObjImgHeight"].ToString();
                jsonHelper.AddItem("objImgWidth", objImgWidth);
                jsonHelper.AddItem("objImgHeight", objImgHeight);
                jsonHelper.ItemOk();
            }


            strObjInfo = jsonHelper.ToString();

            return strObjInfo;
        }

        /// <summary>
        /// 添加物标到数据库中
        /// </summary>
        /// <param name="objLayerId">所属的图层</param>
        /// <param name="objType">物标类型:0=点类型，1=线类型，2=面类型</param>
        /// <param name="objName">物标的名称</param>
        /// <param name="objContent">物标备注</param>
        /// <param name="objGeo">物标坐标</param>
        /// <param name="company">所属公司</param>
        /// <param name="objStyleId">物标样式id</param>
        /// <param name="objImgUrl">假如是点物标，那么指定的图片路径</param>
        /// <returns>返回物标在数据库中的id</returns>
        [WebMethod()]
        //添加新物标信息到数据库，并返回物标的再数据库中的id，即serverId
        public int API_AddObjToData(string objLayerId, string objType, string objName, string objContent, string objGeo, string company, string objStyleId, string objImgUrl)
        {
            int imgWidth = 0;
            int imgHeight = 0;
            if (!objImgUrl.Equals(""))
            {
                API_GetImgSizeByUrl(objImgUrl, ref imgWidth, ref imgHeight);
            }

            int iPointServerId = -1;
            string strSql = "insert into ObjTable(iObjLayerId,strObjName,strObjContent,strObjGeo,dtObjDate,strCompany,iObjStyleId,strObjImgUrl,iObjImgWidth,iObjImgHeight)values(@objLayerId,@objName,@objContent,@objGeo,@objDate,@company,@objStyleId,@objImgUrl,@objImgWidth,@objImgHeight)";
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

                    cmd.Parameters.Add("objGeo", OleDbType.VarChar, 2000);
                    cmd.Parameters["objGeo"].Value = objGeo;

                    cmd.Parameters.Add("objDate", OleDbType.Date);
                    cmd.Parameters["objDate"].Value = DateTime.Now;

                    cmd.Parameters.Add("company", OleDbType.VarChar, 50);
                    cmd.Parameters["company"].Value = company;

                    cmd.Parameters.Add("objStyleId", OleDbType.Integer);
                    cmd.Parameters["objStyleId"].Value = Convert.ToInt32(objStyleId);

                    cmd.Parameters.Add("objImgUrl", OleDbType.VarChar, 50);
                    cmd.Parameters["objImgUrl"].Value = objImgUrl;

                    cmd.Parameters.Add("objImgWidth", OleDbType.Integer);
                    cmd.Parameters["objImgWidth"].Value = imgWidth;

                    cmd.Parameters.Add("objImgHeight", OleDbType.Integer);
                    cmd.Parameters["objImgHeight"].Value = imgHeight;
                    try
                    {
                        conn.Open();
                        int i = cmd.ExecuteNonQuery();

                        if (i > 0)//得到刚刚插入的记录id（即标注id）
                        {
                            cmd.CommandText = "select @@identity as id";
                            iPointServerId = Convert.ToInt32(cmd.ExecuteScalar());
                        }
                    }
                    catch (Exception ex)
                    {
                        string message = ex.ToString();
                    }
                }
            }

            return iPointServerId;
        }

        /// <summary>
        /// 获取网络图片的尺寸大小
        /// </summary>
        /// <param name="url">图片的地址</param>
        /// <param name="width">返回的图片宽度(px)</param>
        /// <param name="height">返回的图片高度(px)</param>
        /// <returns></returns>
        private bool API_GetImgSizeByUrl(string url, ref int width, ref int height)
        {
            bool bResult = false;
            try
            {
                System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(url);
                System.Net.WebResponse response = request.GetResponse();
                Stream stream = response.GetResponseStream();
                byte[] buffer = new byte[1024];

                if (!response.ContentType.ToLower().StartsWith("text/"))
                {

                    Stream outStream = new MemoryStream();
                    Stream inStream = response.GetResponseStream();

                    int bufferLength;
                    do
                    {
                        bufferLength = inStream.Read(buffer, 0, buffer.Length);
                        if (bufferLength > 0)
                            outStream.Write(buffer, 0, bufferLength);
                    }
                    while (bufferLength > 0);

                    outStream.Flush();
                    outStream.Seek(0, SeekOrigin.Begin);
                    inStream.Close();

                    System.Drawing.Image image = System.Drawing.Image.FromStream(outStream);
                    outStream.Close();
                    width = image.Width;
                    height = image.Height;
                    image.Dispose();
                    bResult = true;
                }

            }
            catch (Exception ex)
            {

            }
            return bResult;
        }

        /// <summary>
        /// 根据物标的id删除物标
        /// </summary>
        /// <param name="iObjServerId">物标在数据库中的id</param>
        /// <returns>是否删除成功：true=成功，false=失败</returns>
        [WebMethod()]
        public bool API_DelObjFromDataByObjServerId(int iObjServerId)
        {
            bool bResult = false;
            string strSql = "Delete from ObjTable where id = @id";
            string strConn = YimaDataBase.GetSqlConnectionString();

            using (OleDbConnection conn = new OleDbConnection(strConn))
            {
                using (OleDbCommand cmd = new OleDbCommand(strSql, conn))
                {
                    cmd.Parameters.Add("id", OleDbType.Integer);
                    cmd.Parameters["id"].Value = iObjServerId;

                    try
                    {
                        conn.Open();
                        int i = cmd.ExecuteNonQuery();

                        if (i > 0)
                        {
                            bResult = true;
                        }
                    }
                    catch (Exception ex)
                    {
                        string message = ex.ToString();
                    }
                }
            }
            return bResult;
        }

        /// <summary>
        /// 修改物标的坐标值
        /// </summary>
        /// <param name="iServerId">物标的id</param>
        /// <param name="strObjGeo">物标的坐标</param>
        /// <returns>是否设置成功：true=成功，false=失败</returns>
        [WebMethod()]
        public bool API_SetObjectGeoByServerId(int iServerId, string strObjGeo)
        {
            bool bResult = false;
            //string strSql = "update ObjTable set strObjGeo=@objGeo where id = @id";
            string strConn = YimaDataBase.GetSqlConnectionString();
            strObjGeo = strObjGeo.Replace("'", "‘");

            string strSql = "update ObjTable set strObjGeo='" + strObjGeo + "' where id = " + iServerId.ToString();
            int ii = YimaDataBase.ExecuteSql(strSql, strConn);

            if (ii > 0)
            {
                bResult = true;
            }
            return ii > 0;
            /*
            using (OleDbConnection conn = new OleDbConnection(strConn))
            {
                using (OleDbCommand cmd = new OleDbCommand(strSql, conn))
                {
                    cmd.Parameters.Add("id", OleDbType.Integer);
                    cmd.Parameters["id"].Value = iServerId;

                    cmd.Parameters.Add("objGeo", OleDbType.VarChar, 2000);
                    cmd.Parameters["objGeo"].Value = strObjGeo;

                    try
                    {
                        conn.Open();
                        int i = cmd.ExecuteNonQuery();

                        if (i > 0)
                        {
                            bResult = true;
                        }
                    }
                    catch (Exception ex)
                    {
                        string message = ex.ToString();
                    }
                }
            }
             
            return bResult;
            */
        }

        /// <summary>
        /// 修改物标的备注
        /// </summary>
        /// <param name="iServerId">物标的id</param>
        /// <param name="strObjectContent">备注</param>
        /// <returns>是否设置成功：true=成功，false=失败</returns>
        [WebMethod()]
        public bool API_SetObjectContentByServerId(int iServerId, string strObjectContent)
        {
            strObjectContent = strObjectContent.Replace("'", "’");
            string strConn = YimaDataBase.GetSqlConnectionString();

            string strSql = "update ObjTable set strObjContent='" + strObjectContent + "' where id = " + iServerId.ToString();
            int ii = YimaDataBase.ExecuteSql(strSql, strConn);

            return ii > 0;
            /*
            string strSql = "update ObjTable set strObjContent=@strObjContent where id = @id";
            using (OleDbConnection conn = new OleDbConnection(strConn))
            {
                using (OleDbCommand cmd = new OleDbCommand(strSql, conn))
                {
                    cmd.Parameters.Add("id", OleDbType.Integer);
                    cmd.Parameters["id"].Value = iServerId;

                    cmd.Parameters.Add("strObjContent", OleDbType.VarChar, 100);
                    cmd.Parameters["strObjContent"].Value = strObjectContent;

                    try
                    {
                        conn.Open();
                        int i = cmd.ExecuteNonQuery();

                        if (i > 0)
                        {
                            bResult = true;
                        }
                    }
                    catch (Exception ex)
                    {
                        string message = ex.ToString();
                    }
                }
            }
            return bResult;
             */
        }

        /// <summary>
        /// 修改物标的名称
        /// </summary>
        /// <param name="iServerId">物标id</param>
        /// <param name="strObjectName">物标名称</param>
        /// <returns>是否设置成功：true=成功，false=失败</returns>
        [WebMethod()]
        public bool API_SetObjectNameByServerId(int iServerId, string strObjectName)
        {
            strObjectName = strObjectName.Replace("'", "’");

            string strConn = YimaDataBase.GetSqlConnectionString();
            string strSql = "update ObjTable set strObjName='" + strObjectName + "' where id = " + iServerId.ToString();
            int ii = YimaDataBase.ExecuteSql(strSql, strConn);
            return ii > 0;

            /*
            bool bResult = false;         
            string strSql = "update ObjTable set strObjName=@objName where id = @id";
            using (OleDbConnection conn = new OleDbConnection(strConn))
            {
                using (OleDbCommand cmd = new OleDbCommand(strSql, conn))
                {
                    cmd.Parameters.Add("id", OleDbType.Integer);
                    cmd.Parameters["id"].Value = iServerId;

                    cmd.Parameters.Add("objName", OleDbType.VarChar, 50);
                    cmd.Parameters["objName"].Value = strObjectName;

                    try
                    {
                        conn.Open();
                        int i = cmd.ExecuteNonQuery();

                        if (i > 0)
                        {
                            bResult = true;
                        }
                    }
                    catch (Exception ex)
                    {
                        string message = ex.ToString();
                    }
                }
            }
            return bResult;
             * */
        }

        /// <summary>
        /// 修改点物标的显示图片地址
        /// </summary>
        /// <param name="iServerId">物标id</param>
        /// <param name="strObjImgUrl">图片地址</param>
        /// <returns>是否设置成功：true=成功，false=失败</returns>
        [WebMethod()]
        public bool API_SetObjImgUrlByServerId(int iServerId, string strObjImgUrl)
        {
            bool bResult = false;

            int imgWidth = 0;
            int imgHeight = 0;

            bool bGetSizeResult = API_GetImgSizeByUrl(strObjImgUrl, ref imgWidth, ref imgHeight);
            if (bGetSizeResult == true)
            {
                string strConn = YimaDataBase.GetSqlConnectionString();
                strObjImgUrl = strObjImgUrl.Replace("'", "‘");
                string strSql = "update ObjTable set strObjImgUrl='" + strObjImgUrl + "',iObjImgWidth=" + imgWidth.ToString() + ",iObjImgHeight=" + imgHeight.ToString() + " where id = " + iServerId.ToString();
                int ii = YimaDataBase.ExecuteSql(strSql, strConn);

                if (ii > 0)
                {
                    bResult = true;
                }
                /*
                string strSql = "update ObjTable set strObjImgUrl=@objImgUrl,iObjImgWidth=@iObjImgWidth,iObjImgHeight=@iObjImgHeight where id = @id";
                using (OleDbConnection conn = new OleDbConnection(strConn))
                {
                    using (OleDbCommand cmd = new OleDbCommand(strSql, conn))
                    {
                        cmd.Parameters.Add("id", OleDbType.Integer);
                        cmd.Parameters["id"].Value = iServerId;

                        cmd.Parameters.Add("objImgUrl", OleDbType.VarChar, 50);
                        cmd.Parameters["objImgUrl"].Value = strObjImgUrl;

                        cmd.Parameters.Add("iObjImgWidth", OleDbType.Integer);
                        cmd.Parameters["iObjImgWidth"].Value = imgWidth;

                        cmd.Parameters.Add("iObjImgHeight", OleDbType.Integer);
                        cmd.Parameters["iObjImgHeight"].Value = imgHeight;

                        try
                        {
                            conn.Open();
                            int i = cmd.ExecuteNonQuery();

                            if (i > 0)
                            {
                                bResult = true;
                            }
                        }
                        catch (Exception ex)
                        {
                            string message = ex.ToString();
                        }
                    }
                }
                 * */
            }
            return bResult;
        }
        #endregion


        #region 船舶接口

        /// <summary>
        /// 获取船舶的信息
        /// </summary>
        /// <param name="bGetAllShip">是否获取所有船舶的信息:true=获取所有船舶，false=根据指定获取</param>
        /// <param name="iStartPos">指定获取船舶时候，船舶在数组中的起始Pos</param>
        /// <param name="iGetShipCount">指定获取船舶时候，获取船舶的总数</param>
        /// <returns>返回船舶的信息，格式为json格式，例如{"result":"1","returnval":[{"id":"2","mmsi":"100","name":"shipName","speed":"12","course":"0","geoX":"1210634093","geoY":"311721615","time":"2015/5/15 8:35:09",},{...}]}"</returns>
        [WebMethod()]
        public string API_GetShipsInfoReturnJsonString(bool bGetAllShip, int iStartPos, int iGetShipCount)
        {
            if (iStartPos < 0)
            {
                iStartPos = 0;
            }
            string strResult = SHIP_MAN.GetShipsInfoReturnJsonString(bGetAllShip, iStartPos, iGetShipCount);

            return strResult;
        }

        /// <summary>
        /// 根据时间获取船舶信息
        /// </summary>
        /// <param name="bGetAllShip">是否获取所有船舶的信息:true=获取所有船舶，false=根据指定获取</param>
        /// <param name="iStartPos">指定获取船舶时候，船舶在数组中的起始Pos</param>
        /// <param name="iGetShipCount">指定获取船舶时候，获取船舶的总数</param>
        /// <param name="strDateTime">时间字符串，格式例如:"2015/5/15 12:11:9"</param>
        /// <returns>返回船舶的信息，格式为json格式，例如{"result":"1","returnval":[{"id":"2","mmsi":"100","name":"shipName","speed":"12","course":"0","geoX":"1210634093","geoY":"311721615","time":"2015/5/15 8:35:09",},{...}]}"</returns>
        [WebMethod()]
        public string API_GetShipsInfoReturnJsonStringByTime(bool bGetAllShip, int iStartPos, int iGetShipCount, string strDateTime)
        {
            if (iStartPos < 0)
            {
                iStartPos = 0;
            }
            string strResult = SHIP_MAN.GetShipsInfoReturnJsonStringByTime(bGetAllShip, iStartPos, iGetShipCount, strDateTime);

            return strResult;
        }

        /// <summary>
        /// 根据时间或者区域范围获取船舶信息
        /// </summary>
        /// <param name="bGetAllShip">是否获取所有船舶的信息:true=获取所有船舶，false=根据指定获取</param>
        /// <param name="iStartPos">指定获取船舶时候，船舶在数组中的起始Pos</param>
        /// <param name="iGetShipCount">指定获取船舶时候，获取船舶的总数</param>
        /// <param name="bCheckTime">是否根据时间来判断：true=根据时间来判断，false=不根据时间来判断</param>
        /// <param name="strDateTime">时间字符串，格式例如:"2015/5/15 12:11:9"</param>
        /// <param name="bCheckRect">是否根据区域来判断：true=根据区域来判断，false=不根据区域来判断</param>
        /// <param name="iRectMinGeoX">区域的最小经度：例如1200000000</param>
        /// <param name="iRectMaxGeoX">区域的最大经度：例如1250000000</param>
        /// <param name="iRectMinGeoY">区域的最小纬度：例如300000000</param>
        /// <param name="iRectMaxGeoY">区域的最大纬度：例如350000000</param>
        /// <returns>返回船舶的信息，格式为json格式，例如{"result":"1","returnval":[{"id":"2","mmsi":"100","name":"shipName","speed":"12","course":"0","geoX":"1210634093","geoY":"311721615","time":"2015/5/15 8:35:09",},{...}]}"</returns>
        [WebMethod()]
        public string API_GetShipsInfoReturnJsonStringByTimeOrRect(bool bGetAllShip, int iStartPos, int iGetShipCount, bool bCheckTime, string strDateTime, bool bCheckRect, int iRectMinGeoX, int iRectMaxGeoX, int iRectMinGeoY, int iRectMaxGeoY)
        {
            if (iStartPos < 0)
            {
                iStartPos = 0;
            }
            string strResult = SHIP_MAN.GetShipsInfoReturnJsonStringByTimeOrRect(bGetAllShip, iStartPos, iGetShipCount, bCheckTime, strDateTime, bCheckRect, iRectMinGeoX, iRectMaxGeoX, iRectMinGeoY, iRectMaxGeoY);

            return strResult;
        }

        /// <summary>
        /// 添加船舶
        /// </summary>
        /// <param name="strCurShipInfos">船舶信息字符串，格式为:shipid,mmsi,name,geoX,geoY,course,speed,state,time_....</param>
        /// <returns>返回值:true=添加成功，false=添加失败</returns>
        [WebMethod()]        
        public bool API_AddShipsByStringInfos(string strCurShipInfos)
        {            
            bool bResult = SHIP_MAN.AddShipsByStringInfos(strCurShipInfos);
            return bResult;
        }


        #endregion

        /// <summary>
        /// 获取用户的许可
        /// </summary>
        /// <param name="iUserId">用户id</param>
        /// <returns>返回用户的许可</returns>
        [WebMethod()]
        public string API_RegisterUser(int iUserId)
        {
            string strLicenceKey = "";
            
            YIMAENCSVRLIBLib.YimaEncServerClass yimaEncSvr = new YimaEncServerClass();
            var bResult = false;
            yimaEncSvr.Init(@"D:\YimaEnc Server 2.0", ref bResult);
            string strKey = new String(' ', 19);
            yimaEncSvr.RegisterUser(iUserId, ref strKey);
            strLicenceKey = strKey.Trim();
            
            return strLicenceKey;
        }


    }
}