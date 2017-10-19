/**
 *
 */
package com.sg.abnormalDetection;

import bean.Cell;
import bean.GPS;
import com.sg.domain.Shipinfo;
import com.sg.http.RequestTimerTask;

import util.TileSystem;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

/**
 * @author yuchang xu
 * <p>
 * 2017-09-14
 */
public class iBOATDetection {


    private static Map<String, List<List<Cell>>> supportTrajectoriesMap = new HashMap<>();
    private static Map<String, List<Cell>> adaptiveWindowMap = new HashMap<>();
    private static Map<String, List<List<Cell>>> allTrajectoriesMap = new HashMap<>();

    public static double threshold = 0.04;

    /**
     * iBOAT检测算法
     * 我这里有两个表：1.trajectory 字段：trajectory_id;mmsi;start;end;cell_list(cell坐标对list，中间用分号隔开)
     * 2.invert_index 字段：cell(坐标对);trajectory_id(轨迹编号list，中间用分号隔开)
     * 代码里需要 表中数据时你先这样表示： get+某字段（多个的话用分号隔开）+from+<表名> 例如：get+trajectory+from+<trajectory>
     * mmsi 船舶编号
     *
     * @return 实时是否异常
     */
    public void iBOATOline() {
        List<String> mmsi = new ArrayList<String>();
        for (String num : mmsi) {
            Shipinfo shipinfo = new Shipinfo();
            String longtitude = shipinfo.getLon();
            String lattitude = shipinfo.getLat();

            //TODO 是否要检测？ continue

            //epilog
            List<Cell> adaptiveWindow = adaptiveWindowMap.get(num);
            List<List<Cell>> supportTrajectories = supportTrajectoriesMap.get(num);

            //
            Cell cell = TileSystem.GPSToTile(new GPS(Double.parseDouble(lattitude), Double.parseDouble(longtitude), null));

            adaptiveWindow.add(cell);

            int lastSupportSize = supportTrajectories.size();
            supportTrajectories.removeIf(cells -> !hasCommonPath(adaptiveWindow, cells));

            double support = supportTrajectories.size() * 1.0 / lastSupportSize;
            if (support < threshold) {
                //TODO 异常点异常插入数据库
//				anomalyCells.add(cell);

                supportTrajectories = new ArrayList<>(allTrajectoriesMap.get(num));
                adaptiveWindow.clear();
                adaptiveWindow.add(cell);
            }

            //prolog
            adaptiveWindowMap.put(num, adaptiveWindow);
            supportTrajectoriesMap.put(num, supportTrajectories);

        }
    }

    /**
     * 检测算法中相关函数
     */
    private boolean hasCommonPath(List<Cell> testPath, List<Cell> samplePath) {
        int index = -1;
        boolean search;
        for (Cell cell : testPath) {
            search = false;
            for (int i = index + 1; i < samplePath.size(); i++) {
                if (samplePath.get(i).equals(cell)) {
                    index = i;
                    search = true;
                    break;
                }
            }
            if (!search)
                return false;
        }
        return true;
    }
    
    /**
     * 初始化
     * @throws IOException 
     */
    private void init(String mmsi, String start, String endArea) throws IOException {
        //假设 endArea 114.2222,30.22222;114.3333,30.3333
        String[] endAreas = endArea.split("-");

        //计算网格范围
        int minX = Integer.MAX_VALUE, minY = Integer.MAX_VALUE;
        int maxX = Integer.MIN_VALUE, maxY = Integer.MIN_VALUE;
        for (String onePoint : endAreas) {
            String[] sp = onePoint.split(",");
            //TODO 建议新加一个String转Cell方法
            Cell cell = TileSystem.GPSToTile(new GPS(Double.parseDouble(sp[0]), Double.parseDouble(sp[1]), null));//TODO 检查经纬度的顺序
            minX = Math.min(minX, cell.getTileX());
            minY = Math.min(minY, cell.getTileY());
            maxX = Math.max(maxX, cell.getTileX());
            maxY = Math.max(maxY, cell.getTileY());
        }

        List<Cell> cellArea = new ArrayList<>();
        for (int i = minX; i <= maxX; i++)
            for (int j = minY; j <= maxY; j++)
                cellArea.add(new Cell(i, j));

        //得到经过起点的轨迹
      
        Cell startCell = new Cell(start);//TODO 检查经纬度的顺序

        //TODO get+cell+from+invert_index
        //String startTrajectoryList=getCellFromInvertIndex(startCell);
//        String startTrajectoryList = "1234;2222;3333";
        SqlSession session = RequestTimerTask.getSession();
        String startTrajectoryList = session.selectOne("listcell",startCell.toString());
        List<String> startSet = new ArrayList<>(Arrays.asList(startTrajectoryList.split(";")));

        //得到经过终点的轨迹
        Set<String> endSet = new HashSet<>();
        for (Cell endCell : cellArea) {
            //TODO get+cell+from+invert_index
            //String endTrajectoryList=getCellFromInvertIndex(endCell);
//            String endTrajectoryList = "1234;2222;3333";
        	String endTrajectoryList = session.selectOne("listcell",endCell.toString());
            endSet.addAll(Arrays.asList(endTrajectoryList.split(";")));
        }

        //交集
        startSet.retainAll(endSet);

        //通过id得到轨迹的网格流
        List<List<Cell>> allTrajectories = new ArrayList<>();
        for (String tId : startSet) {
            //TODO get+cell_list+from+trajectory
            //String cellList=getCellListFromTrajectory(tId);
//            String cellList = "[111,222];[112,222];[113,222]";
        	String cellList = session.selectOne("getcelllistbyid",tId);
            String[] csp = cellList.split(";");
            List<Cell> oneTrajectory = new ArrayList<>();
            for (String cs : csp) {
                oneTrajectory.add(new Cell(cs));
            }

            allTrajectories.add(oneTrajectory);
        }

        allTrajectoriesMap.put(mmsi, allTrajectories);
    }

    /**
     * 完成
     */
    private void finish(String mmsi) {
        adaptiveWindowMap.remove(mmsi);
        supportTrajectoriesMap.remove(mmsi);
    }

}
