# 卡牌费用检查清单

请对照卡牌图片，检查以下费用数据是否正确：

## 费用说明
- **cost**: 部署费用（左上角大数字）
- **moveCost**: 移动费用（左上角小数字，仅单位卡有）
- **attack**: 攻击力（中下方左边数字，仅单位卡有）
- **health**: 生命值（中下方右边数字，仅单位卡有）

---

## 法国卡牌

1. **巴黎断头台卫队** - cost: 3, moveCost: 1, attack: 3, health: 2
2. **拉法耶特侯爵** - cost: 5, moveCost: 1, attack: 3, health: 4
3. **断头台** - cost: 2 (order卡，无moveCost/attack/health)
4. **法国革命·瓦米扬之战** - cost: 4 (order卡)
5. **雅各宾狂热步兵** - cost: 3, moveCost: 1, attack: 3, health: 1
6. **革命龙骑兵中队** - cost: 4, moveCost: 2, attack: 3, health: 2
7. **法国人** - cost: 2, moveCost: 1, attack: 2, health: 1
8. **拿破仑·波拿巴** - cost: 8, moveCost: 1, attack: 4, health: 5
9. **雾月政变** - cost: 3 (order卡)
10. **三级会议召开** - cost: 1 (order卡)
11. **无套裤汉义军** - cost: 2, moveCost: 1, attack: 2, health: 2
12. **革命散兵斥候** - cost: 2, moveCost: 2, attack: 1, health: 2
13. **共和野战炮兵** - cost: 5, moveCost: 1, attack: 5, health: 2
14. **启蒙沙龙** - cost: 2 (order卡)
15. **国革命军龙骑兵** - cost: 4, moveCost: 2, attack: 3, health: 3
16. **巴黎革命民众** - cost: 2, moveCost: 1, attack: 1, health: 2
17. **莱茵阵线守备兵** - cost: 4, moveCost: 1, attack: 2, health: 3
18. **街头演说** - cost: 1 (order卡)
19. **革命浪潮动员** - cost: 2 (order卡)
20. **巴士底狱攻坚队** - cost: 3, moveCost: 1, attack: 3, health: 3
21. **凡尔赛妇女游行队伍** - cost: 2, moveCost: 1, attack: 2, health: 2

## 美国卡牌

22. **罗德岛黑人士兵连** - cost: 3, moveCost: 1, attack: 3, health: 2
23. **大陆军野战炮兵连** - cost: 5, moveCost: 2, attack: 2, health: 4
24. **莱克星顿枪声** - cost: 2 (order卡)
25. **大陆军列兵** - cost: 2, moveCost: 1, attack: 2, health: 1
26. **大陆军掷弹兵** - cost: 4, moveCost: 2, attack: 4, health: 3
27. **波士顿倾茶事件** - cost: 1 (order卡)
28. **约克镇大陆军** - cost: 3, moveCost: 1, attack: 3, health: 2
29. **大陆军重骑兵卫队** - cost: 5, moveCost: 1, attack: 4, health: 4
30. **大陆军要塞炮兵** - cost: 5, moveCost: 2, attack: 4, health: 2
31. **来克星顿民兵** - cost: 2, moveCost: 1, attack: 2, health: 1
32. **殖民地来复枪兵** - cost: 2, moveCost: 1, attack: 1, health: 3
33. **独立宣言** - cost: 5 (order卡)
34. **大陆军精锐步枪手** - cost: 3, moveCost: 1, attack: 3, health: 2 ⚠️ (用户报告显示5费，但代码中是3费)

---

## 已知问题

- **大陆军精锐步枪手**: 代码中cost是3，但用户报告显示5费

请检查所有卡牌图片，如果发现费用、攻击力、生命值或移动费用与代码不一致，请告知具体卡牌名称和正确数值。


