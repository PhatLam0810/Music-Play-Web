document.addEventListener("DOMContentLoaded", function () { //Đảm bảo content HTML đã được chạy trước khi js querySelector chọc vào
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const PLAYER_STORAGE_KEY = 'F8_PLAYER'

    const playlist = $('.playlist');
    const heading = $('header h2')
    const cd = $('.cd')
    const cdThumb = $('.cd-thumb')
    const audio = $('#audio')
    const playBtn = $('.btn-toggle-play')
    const player = $('.player')
    const progress = $('#progress')
    const nextBtn = $('.btn-next')
    const prevBtn = $('.btn-prev')
    const randomBtn = $('.btn-random')
    const repeatBtn = $('.btn-repeat')

    let cdThumbAnimate = null; // Khởi tạo biến cdThumbAnimate
    let currentRotation = 0; // Khởi tạo biến currentRotation


    const app = {
        currentIndex : 0,
        isPlaying : false,
        isRandom : false,
        isRepeat : false,
        playedIndices : [],
        config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        songs : [
            {
                name : 'Thời gian sẽ chữa lành tất cả',
                singer : 'Lâm Phúc',
                path : './assets/music/ThoiGianSeChuaLanhTatCa-LamPhuc-14233024.mp3',
                image : './assets/img/thoigiansechualanhtatca.jpg'
            },
            {
                name : 'Giá như em nhìn lại',
                singer : 'JSOL',
                path : './assets/music/GiaNhuEmNhinLai-JSOL-13090066.mp3',
                image : './assets/img/gianhuemnhinlai.jpg'
            },
            {
                name : 'Đau nhất là lặng im',
                singer : 'ERIK',
                path : './assets/music/DauNhatLaLangIm-ERIK-7130326.mp3',
                image : './assets/img/daunhatlalangim.jfif'
            },
            {
                name : 'Tình yêu đến sau',
                singer : 'MyraTran',
                path : './assets/music/TinhYeuDenSau-MyraTran-8294285.mp3',
                image : './assets/img/tinhyeudensau.webp'
            },
            {
                name : 'Âm Thầm Bên Em',
                singer : 'Sơn Tùng MTP',
                path : './assets/music/AmThamBenEm-SonTungMTP-4066476.mp3',
                image : './assets/img/amthambenem.jpg'
            },
            {
                name : 'Bông Hoa Đẹp Nhát',
                singer : 'Quân AP',
                path : './assets/music/BongHoaDepNhat-QuanAP-6607955.mp3',
                image : './assets/img/bonghoadepnhat.jpg'
            },
            {
                name : 'Cảm Ơn Vì Đã Yêu',
                singer : 'Darki ',
                path : './assets/music/CAMONVIDAYEU-DarkiVietNamCM1X-14775266.mp3',
                image : './assets/img/camonvidayeu.jpg'
            },
            {
                name : 'Chúng Ta Chỉ Là Đã Từng',
                singer : 'Orange',
                path : './assets/music/ChungTaChiLaDaTung-HuaKimTuyenOrange-8412421.mp3',
                image : './assets/img/chungtachiladatung.jpg'
            },
            {
                name : 'Đợi Đến Tháng 13',
                singer : 'Vũ Thịnh',
                path : './assets/music/DoiDenThang13-VuThinh-14132282.mp3',
                image : './assets/img/doi den thang 13.jpg'
            },
            {
                name : 'Gặp Lại Ta Năm 60',
                singer : 'Orange',
                path : './assets/music/GapLaiNamTa60-Orange-13308951.mp3',
                image : './assets/img/gaplaitanam60.jpg'
            },
            {
                name : 'Là Do Em Xui Thôi',
                singer : 'Khói Sofia',
                path : './assets/music/LaDoEmXuiThoi-KhoiSofiaDanTrangChauDangKhoa-7125647.mp3',
                image : './assets/img/ladoemxuithoi.jpg'
            },
            {
                name : 'Quá Khứ Đôi Hiện Tại Đơn',
                singer : 'Đức Phúc',
                path : './assets/music/QuaKhuDoiHienTaiDon-DucPhuc-7972765.mp3',
                image : './assets/img/quakhudoihientaidon.jpg'
            },
            {
                name : 'Tìm Được Nhau Khó Thế Nào',
                singer : 'Anh Tú',
                path : './assets/music/TimDuocNhauKhoTheNaoOriginalMovieSoundtrackFromChiaKhoaTramTy-AnhTuTheVoice-7127088.mp3',
                image : './assets/img/timduocnhaukhothenao.jpg'
            },
           
         
        ],
        setConfig : function ( key ,value ){
            this.config[key] = value;
            localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
        }, 
        renderMusicAdd : function(){
            const htmls = this.songs.map((song,index) => {
            return `    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
               
                </div>`
            })
           playlist.innerHTML = htmls.join('')
        },
        defineProperties: function(){
            Object.defineProperty(this, 'currentSong', {
              get: function () {
                return this.songs[this.currentIndex];
              }
            });
            
        },
        handleEvents: function(){
            const cdwidth = cd.offsetWidth
       
            // Xử lí CD quay và dừng
            function startCdThumbAnimation() {
               cdThumbAnimate = cdThumb.animate([
                { transform: `rotate(${currentRotation}deg)` }, // Bắt đầu từ góc quay hiện tại
                { transform: `rotate(${currentRotation + 360}deg)` } // Quay 360 độ nếu cần
                ], {
                    duration: 100000, // Thời gian quay một vòng là 100000ms (100 giây)
                    iterations: Infinity // Lặp vô hạn
                });
            }
        
          
            // Xử lí phóng to / thu nhỏ cái cd
            document.onscroll = function(){
                const scrollTop = window.scrollY || document.documentElement.scrollTop
                const newCdWidth = cdwidth - scrollTop

                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
                cd.style.opacity = newCdWidth / cdwidth
            }
            // Xử lí khi click play
            playBtn.onclick = function(){
                if (audio.readyState === 4) {
                if(app.isPlaying){
                    audio.pause()
                } else{
                    audio.play()
                }
            }
            }
            // Khi song được play
            audio.onplay = function(){
                app.isPlaying = true
                player.classList.add('playing')
                if (cdThumbAnimate) cdThumbAnimate.play()
            }
            // Khi song được pause
            audio.onpause = function(){
                app.isPlaying = false
                player.classList.remove('playing')
                if (cdThumbAnimate)cdThumbAnimate.pause()
            }
            // Khi tiến độ bài hát thay đổi
            audio.ontimeupdate = function(){
                if(!audio.duration) return ;
                    const progressPercent = (audio.currentTime / audio.duration) * 100;
                    progress.value = progressPercent;
                    const rotationDegrees = (audio.currentTime / audio.duration) * 360;
                    cdThumb.style.transform = `rotate(${rotationDegrees}deg)`;
                    currentRotation = rotationDegrees; // Lưu lại góc quay hiện tại


                    if (!cdThumbAnimate || cdThumbAnimate.playState === 'paused') {
                        startCdThumbAnimation();
                    }
            }
            // Khi tua bài hát
            progress.oninput = function(e){
                const seekTime = audio.duration * (e.target.value / 100);
                audio.currentTime = seekTime;
                currentRotation = (audio.currentTime / audio.duration) * 360; // Cập nhật góc quay hiện tại
                cdThumb.style.transform = `rotate(${currentRotation}deg)`;
            // Dừng animation khi tua bài hát
               if (cdThumbAnimate) {
                cdThumbAnimate.pause();
            }
            }
            // Khi next bài hát 
            nextBtn.onclick = function(){
                if(app.isRandom){
                    app.activeRandomSong()
                } else {
                    app.nextSong()
                }
                audio.play()
                app.renderMusicAdd()
                app.scrollToActiveSong()
            }
              // Khi prev bài hát 
            prevBtn.onclick = function(){
                if(app.isRandom){
                    app.activeRandomSong()
                } else {
                    app.prevSong()
                }
                audio.play()
                app.renderMusicAdd()
                app.scrollToActiveSong()
            }
            // Xử lí next song khi bài hát hết
            audio.onended = function(){
                progress.value = 0; // Đặt lại thanh tiến trình về 0
                cdThumb.style.transform = 'rotate(0deg)'; // Đặt lại góc quay về 0
                if(app.isRepeat){
                    audio.play()
                } else{
                    nextBtn.click()
                }
                if (cdThumbAnimate) {
                    cdThumbAnimate.cancel();
                    cdThumbAnimate = null;
                }
           
            }

            // Khi random bài hát bật tắt
            randomBtn.onclick = function(){
                app.isRandom = !app.isRandom
                app.setConfig('isRandom',app.isRandom)
                randomBtn.classList.toggle('active', app.isRandom)
            }

            // Xử lí khi active nút repeat
            repeatBtn.onclick = function(e){
                app.isRepeat = !app.isRepeat
                app.setConfig('isRepeat',app.isRepeat)
                repeatBtn.classList.toggle('active', app.isRepeat)
            }

            // Click vào bài hát sẽ phát
            playlist.onclick = function (e){
                const songNode = e.target.closest('.song')
                if (songNode || e.target.closest('.option')){
                    // Xử lí khi click vào song
                    if (songNode){
                    const index = Number(songNode.dataset.index);
                    if (index !== app.currentIndex) {
                      app.currentIndex = Number(songNode.dataset.index)
                      app.loadCurrentSong()
                      app.renderMusicAdd()
                      audio.play()
                    }
                    }
                    // Xử lí khi click vào song options
                    if (e.target.closest('.option')){

                    }
                }
            }
        },
        scrollToActiveSong : function(){
           setTimeout(() =>{
                $('.song.active').scrollIntoView({
                    behavior : 'smooth',
                    block : 'center',
                })
            }, 300) 
        },
        loadCurrentSong: function(){
            heading.textContent = this.currentSong.name
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
            audio.src = this.currentSong.path
           
        },
        loadConfig: function(){
            this.isRandom = this.config.isRandom
            this.isRepeat = this.config.isRepeat
        },
        nextSong: function(){
            this.currentIndex++
            if(this.currentIndex >= this.songs.length  ){
                this.currentIndex= 0
            }
            this.loadCurrentSong()
        },
        prevSong: function(){
            this.currentIndex--
            if(this.currentIndex < 0){
                this.currentIndex = this.songs.length -1 
            }
            this.loadCurrentSong()
        },
        activeRandomSong: function(){
            let newIndex
            if (this.playedIndices.length === this.songs.length ) {
                this.playedIndices = []; // Đặt lại danh sách đã random
            }
            do {
                newIndex = Math.floor(Math.random()* this.songs.length)
            } while (this.playedIndices.includes(newIndex));
                this.playedIndices.push(newIndex);
                this.currentIndex = newIndex
                this.loadCurrentSong()
            
        },
        start : function(){
            // Gắn cấu hình từ config vào app
            this.loadConfig()
            // Định nghĩa các thuộc tính cho Object add
            this.defineProperties()
            // Lắng nghe và xử lý các sự kiện
            this.handleEvents()
            // Tải thông tin bài hát đầu tiên vào UI khi chạy
            this.loadCurrentSong()
            // Render
            this.renderMusicAdd()

            // Hiện thị trạng thái ban đầu của button repeat và random
            repeatBtn.classList.toggle('active', app.isRepeat)
            randomBtn.classList.toggle('active', app.isRandom)
       
        }
    };
        app.start();
 });

