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
using System.IO;
using System.Data.OleDb;
using System.Collections;
using System.Text;

namespace YimaWebService
{
    /// <summary>
    ///YimaClass 的摘要说明
    /// </summary>
    public class YimaClass
    {
        public YimaClass()
        {
            //
            //TODO: 在此处添加构造函数逻辑
            //
        }
    }

    public class YimaDataBase
    {        
        private static string m_strSqlConnection = "";

        private static string GetSqlConnectionStringFromIniFile()
        {
            string strSqlConnectionString = "";
            string strIniFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "config.ini");

            StreamReader reader = null;
            try
            {
                string strDataPath = "";
                string strDataUserPsw = "";
                string strAccessConnection = "";
                reader = new StreamReader(strIniFilePath);
                for (string strImportAISSen = reader.ReadLine(); strImportAISSen != null; strImportAISSen = reader.ReadLine())
                {
                    string[] strTxtValue = System.Text.RegularExpressions.Regex.Split(strImportAISSen, "==");
                    if (strTxtValue.Length == 2)
                    {
                        string strType = strTxtValue[0];
                        switch (strType)
                        {
                            case "strDataPath":
                                strDataPath = strTxtValue[1].Trim();
                                break;
                            case "strDataUserPsw":
                                strDataUserPsw = strTxtValue[1].Trim();
                                break;
                            case "strAccessConnection":
                                strAccessConnection = strTxtValue[1].Trim();
                                break;
                        }
                    }
                }

                //string strConnection = "Provider=Microsoft.ACE.OLEDB.12.0;";

                strSqlConnectionString = strAccessConnection + ";";

                if (File.Exists(strDataPath))
                {
                    strSqlConnectionString += "Data Source=" + strDataPath + ";";
                }
                else
                {
                    string strCurDataPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, strDataPath);
                    strSqlConnectionString += "Data Source=" + strCurDataPath + ";";
                }

                strSqlConnectionString += "Jet OLEDB:Database Password=" + strDataUserPsw + ";";
            }
            catch (IOException ex)
            {
                string strInfo = ex.Message.ToString();
            }
            finally
            {
                if (reader != null)
                {
                    reader.Close();
                }
            }

            return strSqlConnectionString;
        }

        public static string GetSqlConnectionString()
        {
            if (m_strSqlConnection == "")
            {
                m_strSqlConnection = GetSqlConnectionStringFromIniFile();
            }

            return m_strSqlConnection;
        }

        //执行一条sql，返回影响的记录条数
        public static int ExecuteSql(string sql, string strConn)
        {
            int iResult;
            OleDbConnection conn = new OleDbConnection(strConn);
            OleDbCommand comm = new OleDbCommand(sql, conn);
            try
            {
                conn.Open();
                iResult = comm.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                string strError = ex.ToString();
                iResult = -1;
            }
            finally
            {
                comm.Dispose();
                conn.Close();
            }
            return iResult;
        }

        /// <summary>
        /// 执行一条sql语句，返回一个DataSet
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public static DataSet ExecuteSqlReDataSet(string sql, string strConn)
        {
            OleDbConnection conn = new OleDbConnection(strConn);
            try
            {
                conn.Open();
                OleDbDataAdapter sda = new OleDbDataAdapter(sql, conn);
                DataSet ds = new DataSet();
                sda.Fill(ds, "table");
                return ds;
            }
            catch (Exception er)
            {
                throw er;
            }
            finally
            {
                conn.Close();
            }
        }
    }

    ///JSONHelper 的摘要说明
    /// </summary>
    public class JSONHelper
    {
        public JSONHelper()
        {
            //
            //TODO: 在此处添加构造函数逻辑
            //
        }

        protected System.Collections.ArrayList arrData = new ArrayList();


        //重置，每次新生成一个json对象时必须执行该方法
        public void Reset()
        {
            arrData.Clear();
        }
        #region

        public void AddItem(string name, string value)
        {
            arrData.Add("\"" + name + "\":\"" + value + "\"");
        }

        public void AddItem(string name, int value)
        {
            arrData.Add("\"" + name + "\":\"" + value.ToString() + "\"");
        }

        public void AddItem(string name, bool value)
        {
            arrData.Add("\"" + name + "\":\"" + value.ToString() + "\"");
        }

        public void AddItem(string name, double value)
        {
            arrData.Add("\"" + name + "\":\"" + value.ToString() + "\"");
        }

        public void AddItem(string name, DateTime value)
        {
            arrData.Add("\"" + name + "\":\"" + value.ToString() + "\"");
        }


        #endregion

        public int GetItemCount()
        {
            return arrData.Count;
        }


        public void ItemOk()
        {
            arrData.Add("<BR>");
        }

        //序列化JSON对象，得到返回的JSON代码
        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();

            sb.Append("{\"result\":\"1\",");
            sb.Append("\"returnval\":");

            sb.Append("[");

            if (arrData.Count <= 0)
            {
                sb.Append("]");
            }
            else
            {
                sb.Append("{");
                for (int i = 0; i < arrData.Count; i++)
                {
                    string strCurItem = arrData[i].ToString();
                    if (strCurItem == "<BR>")
                    {
                        sb.Append("}");
                        if (i != arrData.Count - 1)
                        {
                            sb.Append(",{");
                        }
                    }
                    else
                    {
                        sb.Append(strCurItem + ",");
                    }
                }

                sb.Append("]");
            }
            sb.Append("}");
            return sb.ToString();
        }


        public string GetCurJsonString(string strJsonStringName)
        {
            StringBuilder sb = new StringBuilder();

            if (!strJsonStringName.Equals(""))
            {
                sb.Append("\"" + strJsonStringName + "\":");
            }

            sb.Append("[");
            sb.Append("{");
            if (arrData.Count <= 0)
            {
                sb.Append("}]");
            }
            else
            {
                for (int i = 0; i < arrData.Count; i++)
                {
                    string strCurItem = arrData[i].ToString();
                    if (strCurItem == "<BR>")
                    {
                        sb.Append("}");
                        if (i != arrData.Count - 1)
                        {
                            sb.Append(",{");
                        }
                    }
                    else
                    {
                        sb.Append(strCurItem + ",");
                    }
                }

                sb.Append("]");
            }
            return sb.ToString();
        }


        public void AddJsonItemToCurJson(JSONHelper jsonHelper)
        {
            for (int i = 0; i < jsonHelper.GetItemCount(); i++)
            {
                arrData.Add(jsonHelper.arrData[i]);
            }
        }
    }

    public class ShipInfo
    {
        private int m_iShipId = -1;//船舶id
        private int m_iShipMmsi = -1;//船舶mmsi
        private string m_strShipName = "";//船舶名称
        private double m_dShipSpeed = 0;//船舶速度
        private double m_dShipCourse = 0;//船舶航向
        private int m_iShipGeoX = 0;//经度
        private int m_iShipGeoY = 0;//纬度
        private int m_iShipState = 0;//状态
        private DateTime m_dtInfoTime;//时间


        public void SetShipInfo(int iShipId, int iShipMmsi, string strShipName, int iShipGeoX, int iShipGeoY, double dShipSpeed, double dShipCourse,int iShipState, DateTime dtInfoTime)
        {
            m_iShipId = iShipId;
            m_iShipMmsi = iShipMmsi;
            m_strShipName = strShipName;
            m_dShipSpeed = dShipSpeed;
            m_dShipCourse = dShipCourse;
            m_iShipGeoX = iShipGeoX;
            m_iShipGeoY = iShipGeoY;
            m_iShipState = iShipState;
            m_dtInfoTime = dtInfoTime;
        }

        public void UpdateShipInfo(int iShipGeoX, int iShipGeoY, double dShipSpeed, double dShipCourse,int iShipState, DateTime dtInfoTime)
        {
            m_dShipSpeed = dShipSpeed;
            m_dShipCourse = dShipCourse;
            m_iShipGeoX = iShipGeoX;
            m_iShipGeoY = iShipGeoY;
            m_iShipState = iShipState;
            m_dtInfoTime = dtInfoTime;
        }

        public int iShipState
        {
            get { return m_iShipState; }

            set { m_iShipState = value; }
        }

        public string strShipName
        {
            get { return m_strShipName; }

            set { m_strShipName = value; }
        }

        public int iShipId
        {
            get { return m_iShipId; }

            set { m_iShipId = value; }
        }

        public int iShipMmsi
        {
            get { return m_iShipMmsi; }

            set { m_iShipMmsi = value; }
        }

        public int iShipGeoX
        {
            get { return m_iShipGeoX; }

            set { m_iShipGeoX = value; }
        }

        public int iShipGeoY
        {
            get { return m_iShipGeoY; }

            set { m_iShipGeoY = value; }
        }

        public double dShipCourse
        {
            get { return m_dShipCourse; }

            set { m_dShipCourse = value; }
        }

        public double dShipSpeed
        {
            get { return m_dShipSpeed; }

            set { m_dShipSpeed = value; }
        }
        public DateTime dtInfoTime
        {
            get { return m_dtInfoTime; }

            set { m_dtInfoTime = value; }
        }
    }

    public class SHIP_MAN
    {
        private static ShipInfo[] m_arrShipInfo = new ShipInfo[100001];//船舶的数组
        private static int m_iMaxShipCount = 1000000;
        private static int m_iCurShipCount = 0;//当前船舶的总量
        public static int iCurShipCount
        {
            get { return m_iCurShipCount; }

            set { m_iCurShipCount = value; }
        }

        /// <summary>
        /// 添加一艘船舶，假如该船舶存在，那么就更新
        /// </summary>
        /// <param name="curShipInfo">当前船舶的结构体</param>
        /// <returns>返回船舶在数组中的posid</returns>
        public static int AddOneShip(ShipInfo curShipInfo)
        {
            if (m_iCurShipCount > m_iMaxShipCount)
            {
                m_iMaxShipCount--;
            }

            int iShipPos = 0;
            bool bShipInArr = GetCurShipPosInArr(curShipInfo.iShipMmsi, ref iShipPos);
            if (bShipInArr)
            {
                m_arrShipInfo[iShipPos].UpdateShipInfo(curShipInfo.iShipGeoX, curShipInfo.iShipGeoY, curShipInfo.dShipSpeed, curShipInfo.dShipCourse,curShipInfo.iShipState, curShipInfo.dtInfoTime);
            }
            else
            {
                m_arrShipInfo[iShipPos] = curShipInfo;
                m_iCurShipCount++;
            }

            return iShipPos;
        }

        /// <summary>
        /// 根据船舶的mmsi获取其在数组中的pos，假如该船舶不在数组中，那么就要把数组中大于pos的船舶都往数组后面移动一位
        /// </summary>
        /// <param name="iShipMmsi">船舶的mmsi</param>
        /// <param name="iShipPos">返回船舶的pos</param>
        /// <returns>返回值船舶是否在数组中：true=船舶在数组中，false=船舶不在数组中</returns>
        public static bool GetCurShipPosInArr(int iShipMmsi, ref int iShipPos)
        {
            if (m_iCurShipCount == 0)
            {
                iShipPos = 0;
                return false;
            }
            bool bShipInArr = false;

            int iCurShipCount = m_iCurShipCount;//当前船舶数量

            int iFront = 0;
            int iEnd = iCurShipCount - 1;
            int iMid = (iFront + iEnd) / 2;

            try
            {
                while (iFront < iEnd && m_arrShipInfo[iMid].iShipMmsi != iShipMmsi)
                {
                    if (m_arrShipInfo[iMid].iShipMmsi < iShipMmsi)
                    {
                        iFront = iMid + 1;
                    }

                    if (m_arrShipInfo[iMid].iShipMmsi > iShipMmsi)
                    {
                        iEnd = iMid - 1;
                    }

                    iMid = (iFront + iEnd) / 2;
                }

            }
            catch (Exception ex)
            {
                string strErro = ex.ToString();
            }

            if (m_arrShipInfo[iMid].iShipMmsi == iShipMmsi)//该船舶已经在数组中
            {
                iShipPos = iMid;
                bShipInArr = true;
            }
            else//该船舶不在数组中，那么就要把数组中的pos比iMid大的船舶往后移动一个位置
            {
                bShipInArr = false;

                if (m_arrShipInfo[iMid].iShipMmsi > iShipMmsi)
                {
                    iShipPos = iMid;
                }
                else
                {
                    iShipPos = iMid + 1;
                }

                int iMoveMinPos = iShipPos;
                int iMoveCount = m_iCurShipCount - iShipPos;


                for (int i = 0; i < iMoveCount; i++)
                {
                    m_arrShipInfo[m_iCurShipCount - i] = m_arrShipInfo[m_iCurShipCount - i - 1];
                }
            }
            return bShipInArr;
        }

        /// <summary>
        /// 添加船舶
        /// </summary>
        /// <param name="strCurShipInfos">船舶信息字符串，格式为:shipid,mmsi,name,geoX,geoY,course,speed,state,time_....</param>
        /// <returns>返回值:true=添加成功，false=添加失败</returns>
        public static bool AddShipsByStringInfos(string strCurShipInfos)
        {
            bool bResult = false;
            if (!strCurShipInfos.Equals(""))
            {
                string[] arrShipInfoValue = strCurShipInfos.Split(new char[1] { '_' }); ;
                int iCurAddShipCount = arrShipInfoValue.Length;

                for (int i = 0; i < iCurAddShipCount; i++)
                {
                    string[] arrCurShipAtrr = arrShipInfoValue[i].Split(new char[1] { ',' });
                    int iCurShipAtrrCount = arrCurShipAtrr.Length;
                    ShipInfo curShipInfo = new ShipInfo();

                    if (iCurShipAtrrCount > 8)
                    {
                        curShipInfo.iShipId = Convert.ToInt32(arrCurShipAtrr[0]);//shipid
                        curShipInfo.iShipMmsi = Convert.ToInt32(arrCurShipAtrr[1]); //mmsi;
                        curShipInfo.strShipName = arrCurShipAtrr[2].ToString();//name
                        curShipInfo.iShipGeoX = Convert.ToInt32(arrCurShipAtrr[3]);//geoX
                        curShipInfo.iShipGeoY = Convert.ToInt32(arrCurShipAtrr[4]);//geoY
                        curShipInfo.dShipCourse = Convert.ToDouble(arrCurShipAtrr[5]);//course
                        curShipInfo.dShipSpeed = Convert.ToDouble(arrCurShipAtrr[6]);//speed
                        curShipInfo.iShipState = Convert.ToInt32(arrCurShipAtrr[7]);//state
                        curShipInfo.dtInfoTime = Convert.ToDateTime(arrCurShipAtrr[8]);//time

                        SHIP_MAN.AddOneShip(curShipInfo);
                        bResult = true;
                    }
                }
            }

            return bResult;
        }

        /// <summary>
        /// 获取船舶的信息
        /// </summary>
        /// <param name="bGetAllShip">是否获取所有船舶的信息:true=获取所有船舶，false=根据指定获取</param>
        /// <param name="iStartPos">指定获取船舶时候，船舶在数组中的起始Pos</param>
        /// <param name="iGetShipCount">指定获取船舶时候，获取船舶的总数</param>
        /// <returns>返回船舶的信息，格式为json格式，例如{"result":"1","returnval":[{"id":"2","mmsi":"100","name":"shipName","speed":"12","course":"0","geoX":"1210634093","geoY":"311721615","time":"2015/5/15 8:35:09",},{...}]}"</returns>
        public static string GetShipsInfoReturnJsonString(bool bGetAllShip,int iStartPos,int iGetShipCount)
        {
            string strShipJsonInfo = "";
            JSONHelper jsonHelper = new JSONHelper();
            if(iStartPos < 0)
            {
                iStartPos = 0;
            }

            int iGetStartPos = iStartPos;
            int iGetEndPos = iStartPos + iGetShipCount;
            if (bGetAllShip == true)
            {
                iGetStartPos = 0;
                iGetEndPos = m_iCurShipCount;
            }
            else if (iGetEndPos > m_iCurShipCount)
            {
                iGetEndPos = m_iCurShipCount;
            }

            for (int i = iGetStartPos; i < iGetEndPos; i++)
            {
                jsonHelper.AddItem("id", m_arrShipInfo[i].iShipId);
                jsonHelper.AddItem("mmsi", m_arrShipInfo[i].iShipMmsi);
                jsonHelper.AddItem("name", m_arrShipInfo[i].strShipName);
                jsonHelper.AddItem("speed", m_arrShipInfo[i].dShipSpeed);
                jsonHelper.AddItem("course", m_arrShipInfo[i].dShipCourse);
                jsonHelper.AddItem("geoX", m_arrShipInfo[i].iShipGeoX);
                jsonHelper.AddItem("geoY", m_arrShipInfo[i].iShipGeoY);
                jsonHelper.AddItem("state", m_arrShipInfo[i].iShipState);
                jsonHelper.AddItem("time", m_arrShipInfo[i].dtInfoTime);
 
                jsonHelper.ItemOk();
            }

            strShipJsonInfo = jsonHelper.ToString();
            return strShipJsonInfo;
        }

        
        /// <summary>
        /// 根据时间获取船舶信息
        /// </summary>
        /// <param name="bGetAllShip">是否获取所有船舶的信息:true=获取所有船舶，false=根据指定获取</param>
        /// <param name="iStartPos">指定获取船舶时候，船舶在数组中的起始Pos</param>
        /// <param name="iGetShipCount">指定获取船舶时候，获取船舶的总数</param>
        /// <param name="strDateTime">时间字符串，格式例如:"2015/5/15 12:11:9"</param>
        /// <returns>返回船舶的信息，格式为json格式，例如{"result":"1","returnval":[{"id":"2","mmsi":"100","name":"shipName","speed":"12","course":"0","geoX":"1210634093","geoY":"311721615","time":"2015/5/15 8:35:09",},{...}]}"</returns>
        public static string GetShipsInfoReturnJsonStringByTime(bool bGetAllShip, int iStartPos, int iGetShipCount, string strDateTime)
        {
            string strShipJsonInfo = "";
            JSONHelper jsonHelper = new JSONHelper();

            if(!strDateTime.Equals(""))
            {
                try
                {
                    DateTime dtCheckTime = Convert.ToDateTime(strDateTime);
                    if (iStartPos < 0)
                    {
                        iStartPos = 0;
                    }

                    int iGetStartPos = iStartPos;
                    int iGetEndPos = m_iCurShipCount;
                    int iGetAllShipCount = iGetShipCount;
                    int iCurGetShipCount = 0;
                    if (bGetAllShip == true)
                    {
                        iGetStartPos = 0;
                        iGetAllShipCount = m_iCurShipCount;
                    }

                    for (int i = iGetStartPos; i < iGetEndPos; i++)
                    {
                        if (m_arrShipInfo[i].dtInfoTime > dtCheckTime)
                        {
                            jsonHelper.AddItem("id", m_arrShipInfo[i].iShipId);
                            jsonHelper.AddItem("mmsi", m_arrShipInfo[i].iShipMmsi);
                            jsonHelper.AddItem("name", m_arrShipInfo[i].strShipName);
                            jsonHelper.AddItem("speed", m_arrShipInfo[i].dShipSpeed);
                            jsonHelper.AddItem("course", m_arrShipInfo[i].dShipCourse);
                            jsonHelper.AddItem("geoX", m_arrShipInfo[i].iShipGeoX);
                            jsonHelper.AddItem("geoY", m_arrShipInfo[i].iShipGeoY);
                            jsonHelper.AddItem("state", m_arrShipInfo[i].iShipState);
                            jsonHelper.AddItem("time", m_arrShipInfo[i].dtInfoTime);

                            jsonHelper.ItemOk();
                            iCurGetShipCount++;
                            if (iCurGetShipCount == iGetAllShipCount)
                            {
                                break;
                            }
                        }
                    }
                }
                catch(Exception ex)
                {
                    
                }
            }

            strShipJsonInfo = jsonHelper.ToString();
            return strShipJsonInfo;
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
        public static string GetShipsInfoReturnJsonStringByTimeOrRect(bool bGetAllShip, int iStartPos, int iGetShipCount, bool bCheckTime, string strDateTime, bool bCheckRect, int iRectMinGeoX, int iRectMaxGeoX, int iRectMinGeoY, int iRectMaxGeoY)
        {
            DateTime dtCheckTime = DateTime.Now.AddDays(-1);
            bool bIsCheckTimeOk = false;
            if (bCheckTime == true && !strDateTime.Equals(""))
            {
                try
                {
                    dtCheckTime = Convert.ToDateTime(strDateTime);
                    bIsCheckTimeOk = true;
                }
                catch
                {
                
                }
            }



            string strShipJsonInfo = "";
            JSONHelper jsonHelper = new JSONHelper();
            if (iStartPos < 0)
            {
                iStartPos = 0;
            }

            int iGetStartPos = iStartPos;
            int iGetEndPos = m_iCurShipCount;
            int iGetCurShipCount = iGetShipCount;
            int iCurGetShipCount = 0;
            if (bGetAllShip == true)
            {
                iGetStartPos = 0;
                iGetShipCount = m_iCurShipCount;
            }

            for (int i = iGetStartPos; i < iGetEndPos; i++)
            {
                if (bIsCheckTimeOk == true && m_arrShipInfo[i].dtInfoTime < dtCheckTime)
                {
                    continue;
                }

                if (bCheckRect == true)
                {
                    if (m_arrShipInfo[i].iShipGeoX < iRectMinGeoX || m_arrShipInfo[i].iShipGeoX > iRectMaxGeoX
                        || m_arrShipInfo[i].iShipGeoY < iRectMinGeoY || m_arrShipInfo[i].iShipGeoY > iRectMaxGeoY)
                    {
                        continue;
                    }
                    
                }

                jsonHelper.AddItem("id", m_arrShipInfo[i].iShipId);
                jsonHelper.AddItem("mmsi", m_arrShipInfo[i].iShipMmsi);
                jsonHelper.AddItem("name", m_arrShipInfo[i].strShipName);
                jsonHelper.AddItem("speed", m_arrShipInfo[i].dShipSpeed);
                jsonHelper.AddItem("course", m_arrShipInfo[i].dShipCourse);
                jsonHelper.AddItem("geoX", m_arrShipInfo[i].iShipGeoX);
                jsonHelper.AddItem("geoY", m_arrShipInfo[i].iShipGeoY);
                jsonHelper.AddItem("state", m_arrShipInfo[i].iShipState);
                jsonHelper.AddItem("time", m_arrShipInfo[i].dtInfoTime);

                jsonHelper.ItemOk();
                iCurGetShipCount++;
                if (iCurGetShipCount == iGetShipCount)
                {
                    break;
                }
            }

            strShipJsonInfo = jsonHelper.ToString();
            return strShipJsonInfo;
        }
    }
}
