#include <emscripten.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sndfile.h>
#include <unistd.h>

#define BITCODEVERSION	"0.5.0"

EMSCRIPTEN_KEEPALIVE
size_t getchannels( const char* _filename )
{
	SF_INFO sfinfo;
	SNDFILE	*infile = 0;

	memset ((void*)&sfinfo, 0, sizeof(sfinfo)) ;

	infile = sf_open(_filename, SFM_READ, &sfinfo) ;
	if ( !infile ) {	
		printf("getchannels: couldn't open file '%s'\n", _filename) ;
		return 0;
	}

	sf_close (infile);

	printf("getchannels: channels is %d\n", sfinfo.channels) ;
	return sfinfo.channels;
}

EMSCRIPTEN_KEEPALIVE
size_t savesoundfile( const char* _filename, const char* _ptr, size_t _len )
{
	SF_INFO sfinfo;
	SNDFILE	*infile = 0;
	
	/////////////////////////////////////////////////////////////////////////////////////
	// mode = S_IRUSR | S_IWUSR | S_IRGRP | S_IWGRP | S_IROTH | S_IWOTH 
	/////////////////////////////////////////////////////////////////////////////////////

	// |O_BINARY
	int fd = open(_filename, O_CREAT|O_WRONLY|O_TRUNC, 0644);

	if ( fd < 0 ) 
	{
	    printf("savesoundfile: couldn't open file '%s' for writing...\n", _filename);
		return 0;
	}
	else 
	{
	    printf("savesoundfile: open file name '%s' for writing...\n", _filename);
	}

	size_t wc = write(fd, _ptr, _len);
	printf("savesoundfile: write %u bytes...\n", (unsigned int)wc);

	close( fd );
	printf("savesoundfile: close file...\n");

	memset ((void*)&sfinfo, 0, sizeof(sfinfo)) ;

	infile = sf_open(_filename, SFM_READ, &sfinfo) ;
	if ( !infile ) {	
		printf("savesoundfile: unknown file format\n") ;
		return 0;
	}

	sf_close (infile);

	return wc;
}

EMSCRIPTEN_KEEPALIVE
size_t processsoundfile( char* _filename, size_t _startframe, double* _data, size_t _countofframes )
{
	SF_INFO sfinfo ;
	SNDFILE	*infile = 0;

	size_t readcount = 0;

/*
	for ( int i = 0; i < 5; i++ ) {
		printf( "%d: %f; ", i, _data[i] );
	}
	printf( "\n" );
*/
//	printf("filename: \"%s\"; startframe: %u; frames: %u\n", _filename, (unsigned int)_startframe, (unsigned int)_countofframes);	

	memset ((void*)&sfinfo, 0, sizeof (sfinfo)) ;

	infile = sf_open(_filename, SFM_READ, &sfinfo);
	if ( !infile ) {	
		printf("processsoundfile: couldn't open file '%s' for reading\n", _filename) ;
		return 0;
	}

	sf_seek( infile, _startframe, SEEK_SET);

	readcount = sf_readf_double(infile, _data, _countofframes);
	if ( readcount > 0 ) {
		printf("processsoundfile: process frames %u\n", (unsigned int)readcount );
	}

	sf_close (infile);

	return readcount;
}

EMSCRIPTEN_KEEPALIVE
void* wasm_malloc( size_t _datasize )
{
	void* _dataptr = malloc( _datasize );
	if ( _dataptr > 0 ) {
		printf("wasm_malloc: [ %p ] %u bytes\n", _dataptr, (unsigned int)_datasize );
	} else {
	        printf("wasm_malloc failed\n" );
	}
	return _dataptr;
}

EMSCRIPTEN_KEEPALIVE
void wasm_free( void* _dataptr )
{
        printf("wasm_free: [ %p ]\n", _dataptr );
	free( _dataptr );
}

EMSCRIPTEN_KEEPALIVE
char* lib_version()
{
	static char buf [1024] ;
	sf_command (NULL, SFC_GET_LIB_VERSION, buf, sizeof (buf)) ;

	return buf;
}

EMSCRIPTEN_KEEPALIVE
char* bc_version()
{
	static char buf [1024] ;
	strcpy( buf, BITCODEVERSION );

	return buf;
}


int main( int argc, char* argv[] )
{
	printf("WASM libsndfile bitcode module (c) 2019-2020 Vyacheslav Zababurin\n" );
	printf("WASM bitcode module version is %s\n", bc_version() );
	printf("Based on original %s library\n", lib_version() );	

	return 0;
}
