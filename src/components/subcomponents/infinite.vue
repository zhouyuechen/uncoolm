<template>
 <div class="infinite">
    
 <ul
  v-infinite-scroll="loadMore"
  infinite-scroll-disabled="loading"
  infinite-scroll-distance="30" infinite-scroll-immediate-check="loading2" >
  <li v-for="(item,i) in list" :key="i">
      <img v-lazy="item.song.album.picUrl" alt="加载失败"  @click="playthis(item.id)"  > 
      <div><p>{{item.name}}</p><p>{{item.song.artists[0].name}}</p></div>
      <p>发布时间<br>{{item.song.album.publishTime|dateFormat}}</p>

  </li>
</ul>
 
 </div>
</template>
<script>
  //加载当前组件需要第三方模块
  import {Toast} from "mint-ui";
  export default{
    data(){
      return {
        list:[],
        loading:true,
    mid:0,
    loading2:true
      }
    },
    methods:{
      playthis(mid){
        this.$emit("playThis", mid);
      },
        getsimi(){
        
      var url = `personalized/newsong`;
      
     
      this.$http.get(url).then(result => {
        
          this.list=result.body.result;
         if(this.list==undefined){
          this.getsimi();
          return;
        }
          console.log(this.list);
       /*  if(bb==undefined){
          this.getsimi();
          return;
        } */
        
         
       /*  for (let i = 0; i < 5; i++) {
        this.list.push(bb[i]);
       } */
       /* console.log(this.list); */
       
       
      }); 

        },
     loadMore() {
      this.loading = true;
      console.log("执行");
       setTimeout(() => {
           
         
         
        for (let i = 0; i < 5; i++) {
        this.list.push(i);
       }
       console.log(this.list);
       
       this.loading = false;
      

      }, 2500);
                        }
    },
    mounted(){
     this.getsimi();
    }
  }
</script>
<style scoped lang="scss">
$topc:#20b37d;
.infinite>p{
text-align: left;
padding-left: 2rem;
color: $topc;
font-size: 1.1rem;
}
  .infinite{
    -webkit-overflow-scrolling: touch;
      &>ul{
          padding: 0;
          width: 100%;
      }
      &>ul li{
          list-style: none;
          width: 100%;
          height: 100px;
          border-bottom: 1px solid $topc;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-around;
          img{
              width:20%;
              position: absolute;
              left: 10%;
              top:10px;
              border-radius: 10%;
              overflow: hidden;
          }
            &>div{
                margin-left: 130px
            }
      }
  }
  
</style>